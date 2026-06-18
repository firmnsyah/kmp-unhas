"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getBrowserSupabase } from "@/shared/lib/supabase-browser";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { Loader2, MessageCircle, Pencil, Reply, Trash2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const REACTIONS: { key: string; emoji: string }[] = [
  { key: "like", emoji: "👍" },
  { key: "love", emoji: "❤️" },
  { key: "haha", emoji: "😂" },
  { key: "wow", emoji: "😮" },
  { key: "sad", emoji: "😢" },
];

type Author = { full_name: string; avatar_url: string | null };
type ReactionRow = { emoji: string; user_id: string };
type CommentRow = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  reply_to_user_id: string | null;
  author: Author | Author[] | null;
  reactions: ReactionRow[];
};

const one = <T,>(v: T | T[] | null): T | null => (Array.isArray(v) ? (v[0] ?? null) : v);
const SELECT =
  "id, content, created_at, user_id, parent_id, reply_to_user_id, author:profiles!news_comments_user_id_fkey(full_name, avatar_url), reactions:comment_reactions(emoji, user_id)";

function timeAgo(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function CommentSection({ newsId }: { newsId: string }) {
  const supabase = getBrowserSupabase();
  const { confirm } = useConfirm();
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const [{ data: auth }, { data }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("news_comments").select(SELECT).eq("news_id", newsId).order("created_at", { ascending: true }),
    ]);
    setUser(auth.user ?? null);
    setComments((data as CommentRow[]) ?? []);
    setLoading(false);
  }, [supabase, newsId]);

  useEffect(() => {
    // Muat data saat mount; setState terjadi setelah await (bukan sinkron di render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function signInGoogle() {
    if (!supabase) return toast.error("Login belum tersedia.");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}` },
    });
  }
  async function signOut() {
    await supabase?.auth.signOut();
    await load();
  }

  async function submitComment(content: string, parentId: string | null, replyToUserId: string | null) {
    if (!supabase || !user) return;
    if (!content.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("news_comments").insert({
      news_id: newsId,
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId,
      reply_to_user_id: replyToUserId,
    });
    setBusy(false);
    if (error) return toast.error("Gagal mengirim komentar.");
    setReplyTo(null);
    await load();
  }

  async function saveEdit(id: string, content: string) {
    if (!supabase || !content.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("news_comments").update({ content: content.trim() }).eq("id", id);
    setBusy(false);
    if (error) return toast.error("Gagal menyimpan.");
    setEditId(null);
    await load();
  }

  async function remove(id: string) {
    if (!supabase) return;
    const ok = await confirm({ title: "Hapus komentar ini?", confirmText: "Hapus", destructive: true });
    if (!ok) return;
    const { error } = await supabase.from("news_comments").delete().eq("id", id);
    if (error) return toast.error("Gagal menghapus.");
    await load();
  }

  async function toggleReaction(commentId: string, emoji: string, current: string | null) {
    if (!supabase || !user) return signInGoogle();
    if (current === emoji) {
      await supabase.from("comment_reactions").delete().eq("comment_id", commentId).eq("user_id", user.id);
    } else {
      await supabase
        .from("comment_reactions")
        .upsert({ comment_id: commentId, user_id: user.id, emoji }, { onConflict: "comment_id,user_id" });
    }
    await load();
  }

  const authorName = (c: CommentRow) => one(c.author)?.full_name ?? "Pengguna";
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesOf = (id: string) => comments.filter((c) => c.parent_id === id);

  function renderComment(c: CommentRow, isReply = false) {
    const a = one(c.author);
    const mine = user?.id === c.user_id;
    const myReaction = c.reactions.find((r) => r.user_id === user?.id)?.emoji ?? null;
    const counts = REACTIONS.map((r) => ({ ...r, n: c.reactions.filter((x) => x.emoji === r.key).length }));

    return (
      <div key={c.id} className={isReply ? "border-muted mt-3 border-l-2 pl-4" : ""}>
        <div className="flex gap-3">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={a?.avatar_url ?? undefined} alt={authorName(c)} />
            <AvatarFallback>{authorName(c).slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm">
              <span className="font-semibold">{authorName(c)}</span>{" "}
              <span className="text-muted-foreground text-xs">{timeAgo(c.created_at)}</span>
            </p>
            {editId === c.id ? (
              <EditBox initial={c.content} busy={busy} onCancel={() => setEditId(null)} onSave={(v) => saveEdit(c.id, v)} />
            ) : (
              <p className="text-sm text-pretty">{c.content}</p>
            )}

            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {counts.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => toggleReaction(c.id, r.key, myReaction)}
                  className={`rounded-full border px-2 py-0.5 text-xs transition-colors ${myReaction === r.key ? "border-primary bg-primary/10" : "hover:bg-accent"}`}
                >
                  {r.emoji} {r.n > 0 ? r.n : ""}
                </button>
              ))}
              {user ? (
                <button type="button" onClick={() => setReplyTo(replyTo === c.id ? null : c.id)} className="text-muted-foreground hover:text-primary ml-1 inline-flex items-center gap-1 text-xs">
                  <Reply className="size-3.5" /> Balas
                </button>
              ) : null}
              {mine ? (
                <>
                  <button type="button" onClick={() => setEditId(c.id)} className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-xs">
                    <Pencil className="size-3.5" /> Edit
                  </button>
                  <button type="button" onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 text-xs">
                    <Trash2 className="size-3.5" /> Hapus
                  </button>
                </>
              ) : null}
            </div>

            {replyTo === c.id ? (
              <div className="mt-2">
                <CommentBox
                  busy={busy}
                  placeholder={`Balas ${authorName(c)}...`}
                  onSubmit={(v) => submitComment(v, isReply ? c.parent_id : c.id, c.user_id)}
                />
              </div>
            ) : null}
          </div>
        </div>
        {!isReply ? repliesOf(c.id).map((r) => renderComment(r, true)) : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <MessageCircle className="size-5" />
        Komentar ({comments.length})
      </h2>

      {!supabase ? (
        <p className="text-muted-foreground text-sm">Komentar belum tersedia.</p>
      ) : user ? (
        <div className="space-y-2">
          <CommentBox busy={busy} placeholder="Tulis komentar..." onSubmit={(v) => submitComment(v, null, null)} />
          <button type="button" onClick={signOut} className="text-muted-foreground hover:text-primary text-xs">
            Keluar dari akun komentar
          </button>
        </div>
      ) : (
        <Button variant="outline" onClick={signInGoogle}>
          <GoogleIcon /> Login dengan Google untuk berkomentar
        </Button>
      )}

      {loading ? (
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" /> Memuat komentar...
        </p>
      ) : topLevel.length ? (
        <div className="space-y-5">{topLevel.map((c) => renderComment(c))}</div>
      ) : (
        <p className="text-muted-foreground text-sm">Jadilah yang pertama berkomentar.</p>
      )}
    </div>
  );
}

function CommentBox({ onSubmit, busy, placeholder }: { onSubmit: (v: string) => void; busy: boolean; placeholder: string }) {
  const [value, setValue] = useState("");
  return (
    <div className="space-y-2">
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={3} placeholder={placeholder} />
      <Button
        size="sm"
        disabled={busy || !value.trim()}
        onClick={() => {
          onSubmit(value);
          setValue("");
        }}
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : null}
        Kirim
      </Button>
    </div>
  );
}

function EditBox({ initial, onSave, onCancel, busy }: { initial: string; onSave: (v: string) => void; onCancel: () => void; busy: boolean }) {
  const [value, setValue] = useState(initial);
  return (
    <div className="mt-1 space-y-2">
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={2} />
      <div className="flex gap-2">
        <Button size="sm" disabled={busy} onClick={() => onSave(value)}>
          Simpan
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
