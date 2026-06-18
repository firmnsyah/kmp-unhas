"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { DashboardPageHeader } from "@/modules/dashboard";
import { pickLocale } from "@/shared/lib/locale";
import type { GalleryPhoto } from "@/shared/lib/types";
import { ImageUpload } from "@/shared/ui/image-upload";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { addPhoto, deletePhoto } from "../admin-actions";

export function PhotoManager({
  albumId,
  albumTitle,
  photos,
}: {
  albumId: string;
  albumTitle: string;
  photos: GalleryPhoto[];
}) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [pending, startTransition] = useTransition();

  function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (!String(formData.get("image_url") ?? "")) {
      toast.error("Unggah gambar dulu.");
      return;
    }
    startTransition(async () => {
      const res = await addPhoto(formData);
      if (res.ok) {
        toast.success("Foto ditambahkan.");
        form.reset();
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  async function onDelete(id: string) {
    const ok = await confirm({ title: "Hapus foto ini?", confirmText: "Hapus", destructive: true });
    if (!ok) return;
    startTransition(async () => {
      const res = await deletePhoto(id, albumId);
      if (res.ok) {
        toast.success("Foto dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  return (
    <>
      <DashboardPageHeader
        title={albumTitle}
        description="Kelola foto dalam album ini."
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/galeri">
              <ArrowLeft className="size-4" />
              Kembali
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent>
            <form onSubmit={onAdd} className="space-y-4">
              <input type="hidden" name="album_id" value={albumId} />
              <h2 className="font-semibold">Tambah Foto</h2>
              <ImageUpload name="image_url" bucket="gallery" />
              <div className="space-y-2">
                <Label htmlFor="caption_id">Keterangan (opsional)</Label>
                <Input id="caption_id" name="caption_id" />
              </div>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                Tambah Foto
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {photos.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((p) => (
                <div key={p.id} className="group relative aspect-square overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url} alt={pickLocale(p.caption, "id") || "Foto"} className="absolute inset-0 size-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => onDelete(p.id)}
                    aria-label="Hapus foto"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground rounded-lg border border-dashed py-16 text-center text-sm">
              Belum ada foto di album ini.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
