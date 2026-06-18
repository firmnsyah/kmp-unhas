"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useRouter } from "@/i18n/navigation";
import { DashboardPageHeader, DataTable, EmptyRow } from "@/modules/dashboard";
import type { GalleryAlbum } from "@/shared/lib/types";
import { ImageUpload } from "@/shared/ui/image-upload";
import { DatePicker } from "@/shared/ui/date-time-picker";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteAlbum, saveAlbum } from "../admin-actions";

export function AlbumManager({ albums, title, description }: { albums: GalleryAlbum[]; title: string; description?: string }) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryAlbum | null>(null);
  const [pending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(a: GalleryAlbum) {
    setEditing(a);
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveAlbum(formData);
      if (res.ok) {
        toast.success("Album disimpan.");
        setOpen(false);
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  async function onDelete(a: GalleryAlbum) {
    const ok = await confirm({
      title: "Hapus album?",
      description: `"${a.title.id}" beserta semua fotonya akan dihapus.`,
      confirmText: "Hapus",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteAlbum(a.id);
      if (res.ok) {
        toast.success("Album dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Tambah Album
            </Button>
          </DialogTrigger>
        }
      />

      <DataTable
        head={
          <>
            <th>Album</th>
            <th>Foto</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {albums.length ? (
          albums.map((a) => (
            <tr key={a.id}>
              <td className="font-medium">{a.title.id}</td>
              <td className="text-muted-foreground">{a.photo_count ?? 0} foto</td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" aria-label="Kelola foto">
                    <Link href={`/dashboard/galeri/${a.id}`}>
                      <ImageIcon className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(a)} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(a)} aria-label="Hapus">
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={3} message="Belum ada album." />
        )}
      </DataTable>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Album" : "Tambah Album"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <div className="space-y-2">
            <Label htmlFor="title_id">Judul Album</Label>
            <Input id="title_id" name="title_id" defaultValue={editing?.title.id} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_id">Deskripsi</Label>
            <Textarea id="description_id" name="description_id" defaultValue={editing?.description?.id} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Tanggal Kegiatan</Label>
            <DatePicker name="event_date" defaultValue={editing?.event_date ?? null} placeholder="Opsional" />
          </div>
          <div className="space-y-2">
            <Label>Cover Album</Label>
            <ImageUpload name="cover_url" defaultValue={editing?.cover_url} bucket="gallery" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
