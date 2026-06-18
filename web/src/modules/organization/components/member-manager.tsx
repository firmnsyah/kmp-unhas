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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { DataTable, EmptyRow, StatusBadge } from "@/modules/dashboard";
import type { BoardMember, OrgCategory } from "@/shared/lib/types";
import { ImageUpload } from "@/shared/ui/image-upload";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteMember, saveMember } from "../admin-actions";

const CATEGORY_LABEL: Record<OrgCategory, string> = {
  pengurus_inti: "Pengurus Inti",
  pimpinan: "Pimpinan",
  dewan_pembina: "Dewan Pembina",
  dewan_pertimbangan: "Dewan Pertimbangan",
};

export function MemberManager({
  members,
  heading = "Pengurus & Dewan",
  description,
  categories,
  groupByPeriod = false,
  emptyMessage = "Belum ada data.",
}: {
  members: BoardMember[];
  heading?: string;
  description?: string;
  /** Kategori yang dikelola card ini. 1 kategori → terkunci di form. */
  categories: OrgCategory[];
  /** Kelompokkan baris per periode (untuk pimpinan terdahulu). */
  groupByPeriod?: boolean;
  emptyMessage?: string;
}) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BoardMember | null>(null);
  const [pending, startTransition] = useTransition();

  const lockedCategory = categories.length === 1 ? categories[0] : null;
  const showCategoryCol = categories.length > 1;
  const colSpan = (showCategoryCol ? 1 : 0) + 4;

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(m: BoardMember) {
    setEditing(m);
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveMember(formData);
      if (res.ok) {
        toast.success("Data disimpan.");
        setOpen(false);
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  async function onDelete(m: BoardMember) {
    const ok = await confirm({ title: `Hapus ${m.name}?`, confirmText: "Hapus", destructive: true });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteMember(m.id);
      if (res.ok) {
        toast.success("Data dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  // Untuk grup periode: urutkan periode terbaru dulu.
  const periods = groupByPeriod
    ? [...new Set(members.map((m) => m.period))].sort((a, b) => b.localeCompare(a))
    : [];

  function Row({ m }: { m: BoardMember }) {
    return (
      <tr key={m.id}>
        <td className="font-medium">{m.name}</td>
        <td className="text-muted-foreground">{m.position.id}</td>
        {showCategoryCol ? (
          <td>
            <StatusBadge tone={m.category === "pimpinan" ? "info" : "neutral"}>
              {CATEGORY_LABEL[m.category]}
            </StatusBadge>
          </td>
        ) : null}
        <td className="text-muted-foreground">{m.period}</td>
        <td>
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => openEdit(m)} aria-label="Edit">
              <Pencil className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(m)} aria-label="Hapus">
              <Trash2 className="text-destructive size-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  const head = (
    <>
      <th>Nama</th>
      <th>Jabatan</th>
      {showCategoryCol ? <th>Kategori</th> : null}
      <th>Periode</th>
      <th className="text-right">Aksi</th>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{heading}</h2>
          {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
        </div>
        <DialogTrigger asChild>
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" />
            Tambah
          </Button>
        </DialogTrigger>
      </div>

      {groupByPeriod ? (
        members.length ? (
          <div className="space-y-6">
            {periods.map((p) => (
              <div key={p}>
                <h3 className="text-muted-foreground mb-2 text-sm font-medium">Periode {p}</h3>
                <DataTable head={head}>
                  {members.filter((m) => m.period === p).map((m) => (
                    <Row key={m.id} m={m} />
                  ))}
                </DataTable>
              </div>
            ))}
          </div>
        ) : (
          <DataTable head={head}>
            <EmptyRow colSpan={colSpan} message={emptyMessage} />
          </DataTable>
        )
      ) : (
        <DataTable head={head}>
          {members.length ? (
            members.map((m) => <Row key={m.id} m={m} />)
          ) : (
            <EmptyRow colSpan={colSpan} message={emptyMessage} />
          )}
        </DataTable>
      )}

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit" : "Tambah"} {heading}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          {lockedCategory ? <input type="hidden" name="category" value={lockedCategory} /> : null}
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" name="name" defaultValue={editing?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Jabatan</Label>
            <Input id="position" name="position" defaultValue={editing?.position.id} required />
          </div>
          {!lockedCategory ? (
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select name="category" defaultValue={editing?.category ?? categories[0]}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CATEGORY_LABEL[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="period">Periode</Label>
              <Input id="period" name="period" defaultValue={editing?.period ?? "2025/2026"} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Urutan</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch">Angkatan</Label>
            <Input id="batch" name="batch" defaultValue={editing?.batch ?? ""} />
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
