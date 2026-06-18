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
import { DataTable, EmptyRow } from "@/modules/dashboard";
import type { DepartmentMember } from "@/shared/lib/types";
import { ImageUpload } from "@/shared/ui/image-upload";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteDeptMember, saveDeptMember } from "../admin-actions";

export function DeptMemberManager({
  departmentId,
  members,
}: {
  departmentId: string;
  members: DepartmentMember[];
}) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DepartmentMember | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveDeptMember(formData);
      if (res.ok) {
        toast.success("Anggota disimpan.");
        setOpen(false);
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }
  async function onDelete(m: DepartmentMember) {
    const ok = await confirm({ title: `Hapus ${m.name}?`, confirmText: "Hapus", destructive: true });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteDeptMember(m.id, departmentId);
      if (res.ok) {
        toast.success("Anggota dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pengurus Departemen</h2>
        <DialogTrigger asChild>
          <Button size="sm" onClick={() => setEditing(null)}>
            <Plus className="size-4" />
            Tambah
          </Button>
        </DialogTrigger>
      </div>

      <DataTable
        head={
          <>
            <th>Nama</th>
            <th>Jabatan</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {members.length ? (
          members.map((m) => (
            <tr key={m.id}>
              <td className="font-medium">{m.name}</td>
              <td className="text-muted-foreground">{m.position.id}</td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(m); setOpen(true); }} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(m)} aria-label="Hapus">
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={3} message="Belum ada anggota." />
        )}
      </DataTable>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Anggota" : "Tambah Anggota"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="department_id" value={departmentId} />
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <div className="space-y-2">
            <Label htmlFor="m-name">Nama</Label>
            <Input id="m-name" name="name" defaultValue={editing?.name} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="m-position">Jabatan</Label>
              <Input id="m-position" name="position" defaultValue={editing?.position.id} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="m-batch">Angkatan</Label>
              <Input id="m-batch" name="batch" defaultValue={editing?.batch ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="m-sort">Urutan</Label>
            <Input id="m-sort" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
          </div>
          <div className="space-y-2">
            <Label>Foto</Label>
            <ImageUpload name="photo_url" defaultValue={editing?.photo_url} bucket="people" />
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
