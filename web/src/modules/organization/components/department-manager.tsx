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
import { DataTable, EmptyRow } from "@/modules/dashboard";
import type { Department } from "@/shared/lib/types";
import { ImageUpload } from "@/shared/ui/image-upload";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteDepartment, saveDepartment } from "../admin-actions";

export function DepartmentManager({ departments }: { departments: Department[] }) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [pending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(d: Department) {
    setEditing(d);
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveDepartment(formData);
      if (res.ok) {
        toast.success("Departemen disimpan.");
        setOpen(false);
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  async function onDelete(d: Department) {
    const ok = await confirm({
      title: "Hapus departemen?",
      description: `"${d.name.id}" beserta anggota & prokernya akan dihapus.`,
      confirmText: "Hapus",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteDepartment(d.id);
      if (res.ok) {
        toast.success("Departemen dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Departemen</h2>
        <DialogTrigger asChild>
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" />
            Tambah
          </Button>
        </DialogTrigger>
      </div>

      <DataTable
        head={
          <>
            <th>Nama</th>
            <th>Slug</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {departments.length ? (
          departments.map((d) => (
            <tr key={d.id}>
              <td className="font-medium">{d.name.id}</td>
              <td className="text-muted-foreground">{d.slug}</td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" aria-label="Anggota & proker">
                    <Link href={`/dashboard/struktur/departemen/${d.id}`}>
                      <Users className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(d)} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(d)} aria-label="Hapus">
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={3} message="Belum ada departemen." />
        )}
      </DataTable>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Departemen" : "Tambah Departemen"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <div className="space-y-2">
            <Label htmlFor="name_id">Nama Departemen</Label>
            <Input id="name_id" name="name_id" defaultValue={editing?.name.id} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={editing?.slug} placeholder="otomatis dari nama" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_id">Deskripsi</Label>
            <Textarea id="description_id" name="description_id" defaultValue={editing?.description?.id} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">Urutan</Label>
            <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
          </div>
          <div className="space-y-2">
            <Label>Gambar</Label>
            <ImageUpload name="image_url" defaultValue={editing?.image_url} bucket="site" />
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
