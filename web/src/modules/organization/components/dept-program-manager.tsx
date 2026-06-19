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
import { richTextToHtml } from "@/shared/lib/html";
import type { DepartmentProgram } from "@/shared/lib/types";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { RichTextEditor } from "@/shared/ui/rich-text-editor";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteDeptProgram, saveDeptProgram } from "../admin-actions";

export function DeptProgramManager({
  departmentId,
  programs,
}: {
  departmentId: string;
  programs: DepartmentProgram[];
}) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DepartmentProgram | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveDeptProgram(formData);
      if (res.ok) {
        toast.success("Program disimpan.");
        setOpen(false);
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }
  async function onDelete(p: DepartmentProgram) {
    const ok = await confirm({ title: `Hapus program "${p.name.id}"?`, confirmText: "Hapus", destructive: true });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteDeptProgram(p.id, departmentId);
      if (res.ok) {
        toast.success("Program dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Program Kerja</h2>
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
            <th>Program</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {programs.length ? (
          programs.map((p) => (
            <tr key={p.id}>
              <td className="font-medium">{p.name.id}</td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setOpen(true); }} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(p)} aria-label="Hapus">
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={2} message="Belum ada program kerja." />
        )}
      </DataTable>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Program" : "Tambah Program"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="department_id" value={departmentId} />
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <div className="space-y-2">
            <Label htmlFor="p-name">Nama Program</Label>
            <Input id="p-name" name="name_id" defaultValue={editing?.name.id} required />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <RichTextEditor name="description_id" defaultValue={richTextToHtml(editing?.description?.id)} />
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
