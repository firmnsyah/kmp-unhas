"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { DataTable, EmptyRow, StatusBadge } from "@/modules/dashboard";
import { formatDate } from "@/shared/lib/locale";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteComment, setCommentHidden } from "../admin-actions";
import type { CommentRow } from "../admin-queries";

export function CommentTable({ rows }: { rows: CommentRow[] }) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [pending, startTransition] = useTransition();

  function toggle(c: CommentRow) {
    startTransition(async () => {
      const res = await setCommentHidden(c.id, !c.is_hidden);
      if (res.ok) {
        toast.success(c.is_hidden ? "Komentar ditampilkan." : "Komentar disembunyikan.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  async function remove(c: CommentRow) {
    const ok = await confirm({
      title: "Hapus komentar?",
      description: "Komentar akan dihapus permanen dan tidak dapat dikembalikan.",
      confirmText: "Hapus",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteComment(c.id);
      if (res.ok) {
        toast.success("Komentar dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  return (
    <DataTable
      head={
        <>
          <th>Komentar</th>
          <th>Penulis</th>
          <th>Berita</th>
          <th>Status</th>
          <th className="text-right">Aksi</th>
        </>
      }
    >
      {rows.length ? (
        rows.map((c) => (
          <tr key={c.id}>
            <td className="max-w-xs">
              <span className="line-clamp-2">{c.content}</span>
              <span className="text-muted-foreground text-xs">
                {formatDate(c.created_at, "id", { day: "numeric", month: "short" })}
              </span>
            </td>
            <td className="text-muted-foreground">{c.author_name ?? "—"}</td>
            <td className="text-muted-foreground max-w-[12rem]">
              <span className="line-clamp-1">{c.news_title?.id ?? "—"}</span>
            </td>
            <td>
              <StatusBadge tone={c.is_hidden ? "danger" : "success"}>
                {c.is_hidden ? "Disembunyikan" : "Tampil"}
              </StatusBadge>
            </td>
            <td>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => toggle(c)} disabled={pending} aria-label="Sembunyikan/Tampilkan">
                  {c.is_hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(c)} disabled={pending} aria-label="Hapus">
                  <Trash2 className="text-destructive size-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <EmptyRow colSpan={5} message="Belum ada komentar." />
      )}
    </DataTable>
  );
}
