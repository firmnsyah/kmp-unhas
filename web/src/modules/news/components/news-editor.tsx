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
import { useRouter } from "@/i18n/navigation";
import type { NewsCategory } from "@/shared/lib/types";
import { ImageUpload } from "@/shared/ui/image-upload";
import { RichTextEditor } from "@/shared/ui/rich-text-editor";
import { Eye, Loader2, Save, Send } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { saveNews } from "../admin-actions";
import type { NewsEditData, NewsPreviewPayload } from "../admin-queries";
import { NewsPreview } from "./news-preview";

export function NewsEditor({
  categories,
  initial,
  canPublish,
}: {
  categories: NewsCategory[];
  initial?: NewsEditData;
  canPublish: boolean;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [intent, setIntent] = useState("save");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<NewsPreviewPayload | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("intent", intent);
    startTransition(async () => {
      const res = await saveNews(formData);
      if (res.ok) {
        toast.success("Berita disimpan.");
        router.push("/dashboard/berita");
        router.refresh();
      } else {
        toast.error(res.error ?? "Gagal menyimpan.");
      }
    });
  }

  function openPreview() {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    const categoryId = String(fd.get("category_id") ?? "");
    setPreviewData({
      title: String(fd.get("title_id") ?? ""),
      authorName: String(fd.get("author_name") ?? ""),
      categoryName: categories.find((c) => c.id === categoryId)?.name.id ?? null,
      thumbnailUrl: String(fd.get("thumbnail_url") ?? "") || null,
      excerpt: String(fd.get("excerpt_id") ?? ""),
      contentHtml: String(fd.get("content_id") ?? ""),
      status: initial?.status ?? null,
    });
    setPreviewOpen(true);
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}

      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title_id">Judul</Label>
              <Input id="title_id" name="title_id" defaultValue={initial?.title.id} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt_id">Ringkasan singkat</Label>
              <Textarea
                id="excerpt_id"
                name="excerpt_id"
                defaultValue={initial?.excerpt?.id}
                rows={2}
                placeholder="Ringkasan 1–2 kalimat untuk pratinjau berita"
              />
            </div>
            <div className="space-y-2">
              <Label>Konten</Label>
              <RichTextEditor name="content_id" defaultValue={initial?.content.id} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category_id">Kategori</Label>
              <Select name="category_id" defaultValue={initial?.category_id ?? undefined}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="— Tanpa kategori —" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_name">Nama Penulis</Label>
              <Input
                id="author_name"
                name="author_name"
                defaultValue={initial?.author_name ?? ""}
                placeholder="Kosongkan = pakai nama akun"
              />
              <p className="text-muted-foreground text-xs">
                Tampil di halaman berita publik.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Gambar Utama</Label>
              <ImageUpload name="thumbnail_url" defaultValue={initial?.thumbnail_url} bucket="news" />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button type="button" variant="secondary" onClick={openPreview}>
            <Eye className="size-4" />
            Pratinjau
          </Button>
          <Button type="submit" variant="outline" disabled={pending} onClick={() => setIntent("save")}>
            {pending && intent === "save" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Simpan Draf
          </Button>
          {canPublish ? (
            <Button type="submit" disabled={pending} onClick={() => setIntent("publish")}>
              {pending && intent === "publish" ? <Loader2 className="size-4 animate-spin" /> : null}
              Publikasikan
            </Button>
          ) : (
            <Button type="submit" disabled={pending} onClick={() => setIntent("submit")}>
              {pending && intent === "submit" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Kirim untuk Ditinjau
            </Button>
          )}
        </div>
      </div>

      <NewsPreview open={previewOpen} onOpenChange={setPreviewOpen} data={previewData} />
    </form>
  );
}
