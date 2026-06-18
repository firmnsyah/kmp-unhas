"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { getBrowserSupabase } from "@/shared/lib/supabase-browser";
import { DatePicker } from "@/shared/ui/date-time-picker";
import type { User } from "@supabase/supabase-js";
import {
  CheckCircle2,
  FileUp,
  ImageUp,
  Loader2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { submitFormResponse, uploadFormFile } from "../actions";
import type { DynamicForm, FormQuestion } from "../types";

// ---------- File/Image uploader ----------
function FileUploader({
  multiple,
  accept,
  onUpload,
}: {
  multiple: boolean;
  accept: string;
  onUpload: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    const maxMb = accept.startsWith("image") ? 5 : 20;
    for (const f of Array.from(files)) {
      if (f.size > maxMb * 1024 * 1024) {
        toast.error(`"${f.name}" melebihi ${maxMb}MB.`);
        return;
      }
    }
    setUploading(true);
    const newUrls: string[] = [];
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      const res = await uploadFormFile(fd);
      if (!res.ok || !res.url) {
        toast.error("Gagal upload: " + (res.error ?? "tidak diketahui"));
        continue;
      }
      newUrls.push(res.url);
    }
    const merged = multiple ? [...urls, ...newUrls] : newUrls.slice(0, 1);
    setUrls(merged);
    onUpload(merged);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (newUrls.length) toast.success(`${newUrls.length} file terunggah.`);
  }

  function removeUrl(u: string) {
    const next = urls.filter((x) => x !== u);
    setUrls(next);
    onUpload(next);
  }

  const isImage = accept.startsWith("image");

  return (
    <div className="space-y-2">
      {/* Thumbnails */}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((u) => (
            <div key={u} className="group relative">
              {isImage ? (
                <div className="relative size-20 overflow-hidden rounded-md border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt="" className="absolute inset-0 size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeUrl(u)}
                    className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Hapus"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs">
                  <span className="max-w-35 truncate">{u.split("/").pop()}</span>
                  <button type="button" onClick={() => removeUrl(u)} aria-label="Hapus">
                    <X className="size-3 text-destructive" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {(multiple || urls.length === 0) && (
        <label className="border-input hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-4 text-sm transition-colors">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Mengunggah...
            </>
          ) : isImage ? (
            <>
              <ImageUp className="size-4" />{" "}
              {multiple ? "Pilih gambar (bisa lebih dari 1)" : "Pilih gambar"}
            </>
          ) : (
            <>
              <FileUp className="size-4" /> Pilih file (maks 20 MB)
            </>
          )}
        </label>
      )}
    </div>
  );
}

// ---------- Main FormFiller ----------
export function FormFiller({
  form,
  questions,
}: {
  form: DynamicForm;
  questions: FormQuestion[];
}) {
  const supabase = getBrowserSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setReady(true);
    });
  }, [supabase]);

  function signInGoogle() {
    supabase?.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}`,
      },
    });
  }

  function setAnswer(qid: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    for (const q of questions) {
      if (q.is_required) {
        const v = answers[q.id];
        if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) {
          toast.error(`"${q.label.id}" wajib diisi.`);
          return;
        }
      }
    }
    setBusy(true);
    submitFormResponse(form.id, answers).then((res) => {
      setBusy(false);
      if (res.ok) setDone(true);
      else toast.error(res.error ?? "Gagal mengirim.");
    });
  }

  if (!ready) {
    return (
      <p className="text-muted-foreground flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" /> Memuat...
      </p>
    );
  }

  if (done) {
    return (
      <Card className="text-center">
        <CardContent className="space-y-3 py-10">
          <CheckCircle2 className="text-primary mx-auto size-12" />
          <h2 className="text-xl font-bold">Respons Terkirim!</h2>
          <p className="text-muted-foreground">Terima kasih telah mengisi form ini.</p>
          <Button asChild variant="outline">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="space-y-3 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Anda harus login dengan akun Google untuk mengisi form ini.
          </p>
          <Button onClick={signInGoogle}>Login dengan Google</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <Label className="text-sm font-medium leading-snug">
            {q.label.id}
            {q.is_required ? <span className="text-destructive ml-1">*</span> : null}
          </Label>

          {q.type === "long_text" ? (
            <Textarea
              rows={4}
              placeholder="Tulis jawaban Anda..."
              className="resize-y"
              onChange={(e) => setAnswer(q.id, e.target.value)}
            />
          ) : q.type === "dropdown" ? (
            <Select
              value={(answers[q.id] as string) || undefined}
              onValueChange={(v) => setAnswer(q.id, v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="— Pilih —" />
              </SelectTrigger>
              <SelectContent>
                {(q.options ?? []).map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : q.type === "radio" ? (
            <div className="space-y-2 rounded-md border p-3">
              {(q.options ?? []).map((o) => (
                <label key={o} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="radio"
                    name={q.id}
                    value={o}
                    className="accent-primary size-4"
                    onChange={() => setAnswer(q.id, o)}
                  />
                  {o}
                </label>
              ))}
            </div>
          ) : q.type === "checkbox" ? (
            <div className="space-y-2 rounded-md border p-3">
              {(q.options ?? []).map((o) => (
                <label key={o} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    value={o}
                    className="accent-primary size-4"
                    onChange={(e) => {
                      const cur = (answers[q.id] as string[]) ?? [];
                      setAnswer(
                        q.id,
                        e.target.checked ? [...cur, o] : cur.filter((x) => x !== o),
                      );
                    }}
                  />
                  {o}
                </label>
              ))}
            </div>
          ) : q.type === "image_single" ? (
            <FileUploader
              multiple={false}
              accept="image/*"
              onUpload={(urls) => setAnswer(q.id, urls[0] ?? "")}
            />
          ) : q.type === "image_multiple" ? (
            <FileUploader
              multiple={true}
              accept="image/*"
              onUpload={(urls) => setAnswer(q.id, urls)}
            />
          ) : q.type === "file" ? (
            <FileUploader
              multiple={false}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
              onUpload={(urls) => setAnswer(q.id, urls[0] ?? "")}
            />
          ) : q.type === "date" ? (
            <DatePicker
              className="w-full sm:w-64"
              onChange={(v) => setAnswer(q.id, v)}
            />
          ) : (
            <Input
              type={
                q.type === "number"
                  ? "number"
                  : q.type === "email"
                    ? "email"
                    : q.type === "phone"
                      ? "tel"
                      : "text"
              }
              placeholder={
                q.type === "email"
                  ? "email@contoh.com"
                  : q.type === "phone"
                    ? "08xxxxxxxxxx"
                    : q.type === "number"
                      ? "0"
                      : ""
              }
              onChange={(e) => setAnswer(q.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={busy}>
        {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
        Kirim Jawaban
      </Button>
    </form>
  );
}
