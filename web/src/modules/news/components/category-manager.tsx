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
import { useRouter } from "@/i18n/navigation";
import { DashboardPageHeader, DataTable, EmptyRow } from "@/modules/dashboard";
import type { NewsCategory } from "@/shared/lib/types";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory, saveCategory } from "../admin-actions";

export function CategoryManager({
  categories,
  title,
  description,
}: {
  categories: NewsCategory[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsCategory | null>(null);
  const [pending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(cat: NewsCategory) {
    setEditing(cat);
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveCategory(formData);
      if (res.ok) {
        toast.success("Kategori disimpan.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error ?? "Gagal menyimpan.");
      }
    });
  }

  async function onDelete(cat: NewsCategory) {
    const ok = await confirm({
      title: "Hapus kategori?",
      description: `"${cat.name.id}" akan dihapus.`,
      confirmText: "Hapus",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteCategory(cat.id);
      if (res.ok) {
        toast.success("Kategori dihapus.");
        router.refresh();
      } else {
        toast.error(res.error ?? "Gagal menghapus.");
      }
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
              Tambah Kategori
            </Button>
          </DialogTrigger>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <div className="space-y-2">
            <Label htmlFor="name_id">Nama Kategori</Label>
            <Input id="name_id" name="name_id" defaultValue={editing?.name.id} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={editing?.slug} placeholder="otomatis dari nama" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <DataTable
        head={
          <>
            <th>Nama</th>
            <th>Slug</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {categories.length ? (
          categories.map((cat) => (
            <tr key={cat.id}>
              <td className="font-medium">{cat.name.id}</td>
              <td className="text-muted-foreground">{cat.slug}</td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(cat)} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(cat)}
                    aria-label="Hapus"
                  >
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={3} message="Belum ada kategori." />
        )}
      </DataTable>
    </Dialog>
  );
}
