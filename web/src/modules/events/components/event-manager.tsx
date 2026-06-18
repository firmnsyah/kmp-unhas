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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { DashboardPageHeader, DataTable, EmptyRow, StatusBadge } from "@/modules/dashboard";
import { formatDate } from "@/shared/lib/locale";
import type { Department } from "@/shared/lib/types";
import { DateTimePicker } from "@/shared/ui/date-time-picker";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveEvent, deleteEvent } from "../admin-actions";
import type { AdminEvent } from "../admin-queries";

export function EventManager({
  events,
  departments,
  title,
  description,
}: {
  events: AdminEvent[];
  departments: Department[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminEvent | null>(null);
  const [type, setType] = useState<"proker" | "non_proker">("non_proker");
  const [pending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setType("non_proker");
    setOpen(true);
  }
  function openEdit(ev: AdminEvent) {
    setEditing(ev);
    setType(ev.type);
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveEvent(formData);
      if (res.ok) {
        toast.success("Agenda disimpan.");
        setOpen(false);
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  async function onDelete(ev: AdminEvent) {
    const ok = await confirm({
      title: "Hapus agenda?",
      description: `"${ev.title.id}" akan dihapus.`,
      confirmText: "Hapus",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteEvent(ev.id);
      if (res.ok) {
        toast.success("Agenda dihapus.");
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
              Tambah Agenda
            </Button>
          </DialogTrigger>
        }
      />

      <DataTable
        head={
          <>
            <th>Kegiatan</th>
            <th>Jenis</th>
            <th>Waktu</th>
            <th>Status</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {events.length ? (
          events.map((ev) => (
            <tr key={ev.id}>
              <td className="font-medium">{ev.title.id}</td>
              <td>
                <StatusBadge tone={ev.type === "proker" ? "info" : "neutral"}>
                  {ev.type === "proker" ? "Proker" : "Non-Proker"}
                </StatusBadge>
              </td>
              <td className="text-muted-foreground whitespace-nowrap">
                {formatDate(ev.start_at, "id", { day: "numeric", month: "short", year: "numeric" })}
              </td>
              <td>
                <StatusBadge tone={ev.status === "upcoming" ? "success" : "neutral"}>
                  {ev.status === "upcoming" ? "Mendatang" : "Selesai"}
                </StatusBadge>
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(ev)} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(ev)} aria-label="Hapus">
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={5} message="Belum ada agenda." />
        )}
      </DataTable>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Agenda" : "Tambah Agenda"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <div className="space-y-2">
            <Label htmlFor="title_id">Judul Kegiatan</Label>
            <Input id="title_id" name="title_id" defaultValue={editing?.title.id} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_id">Deskripsi</Label>
            <Textarea id="description_id" name="description_id" defaultValue={editing?.description?.id} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" name="location" defaultValue={editing?.location ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Mulai</Label>
              <DateTimePicker name="start_at" defaultValue={editing?.start_at ?? null} />
            </div>
            <div className="space-y-2">
              <Label>Selesai (opsional)</Label>
              <DateTimePicker name="end_at" defaultValue={editing?.end_at ?? null} placeholder="Opsional" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="type">Jenis</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)} name="type">
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non_proker">Non-Proker</SelectItem>
                  <SelectItem value="proker">Proker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={editing?.status ?? "upcoming"}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Mendatang</SelectItem>
                  <SelectItem value="done">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {type === "proker" ? (
            <div className="space-y-2">
              <Label htmlFor="department_id">Departemen Penyelenggara</Label>
              <Select name="department_id" defaultValue={editing?.department_id ?? undefined}>
                <SelectTrigger id="department_id" className="w-full">
                  <SelectValue placeholder="— Pilih departemen —" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
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
