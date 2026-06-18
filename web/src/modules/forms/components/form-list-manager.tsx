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
import { Link, useRouter } from "@/i18n/navigation";
import { DashboardPageHeader, DataTable, EmptyRow, StatusBadge } from "@/modules/dashboard";
import { formatDate } from "@/shared/lib/locale";
import { DateTimePicker } from "@/shared/ui/date-time-picker";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { BarChart2, Link2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteForm, saveForm } from "../admin-actions";
import type { FormListItem } from "../admin-queries";

export function FormListManager({ forms, title, description }: { forms: FormListItem[]; title: string; description?: string }) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("is_active", "on");
    formData.set("show_on_home", "on");
    formData.set("one_response_per_user", "on");
    startTransition(async () => {
      const res = await saveForm(formData);
      if (res.ok && res.id) {
        toast.success("Form dibuat.");
        router.push(`/dashboard/form/${res.id}`);
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  async function onDelete(f: FormListItem) {
    const ok = await confirm({
      title: "Hapus form?",
      description: `"${f.title.id}" beserta semua responsnya akan dihapus.`,
      confirmText: "Hapus",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteForm(f.id);
      if (res.ok) {
        toast.success("Form dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  function copyLink(slug: string) {
    navigator.clipboard.writeText(`${window.location.origin}/form/${slug}`);
    toast.success("Link form disalin.");
  }

  const isClosed = (f: FormListItem) => !f.is_active || new Date(f.deadline_at) < new Date();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Buat Form
            </Button>
          </DialogTrigger>
        }
      />

      <DataTable
        head={
          <>
            <th>Judul</th>
            <th>Deadline</th>
            <th>Respons</th>
            <th>Status</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {forms.length ? (
          forms.map((f) => (
            <tr key={f.id}>
              <td className="font-medium">{f.title.id}</td>
              <td className="text-muted-foreground whitespace-nowrap">
                {formatDate(f.deadline_at, "id", { day: "numeric", month: "short", year: "numeric" })}
              </td>
              <td className="text-muted-foreground">{f.response_count}</td>
              <td>
                <StatusBadge tone={isClosed(f) ? "neutral" : "success"}>
                  {isClosed(f) ? "Ditutup" : "Aktif"}
                </StatusBadge>
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => copyLink(f.slug)} aria-label="Salin link">
                    <Link2 className="size-4" />
                  </Button>
                  <Button asChild variant="ghost" size="icon" aria-label="Kelola">
                    <Link href={`/dashboard/form/${f.id}`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" aria-label="Respons">
                    <Link href={`/dashboard/form/${f.id}/respons`}>
                      <BarChart2 className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(f)} aria-label="Hapus">
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={5} message="Belum ada form." />
        )}
      </DataTable>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Form Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={onCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Form</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input id="description" name="description" />
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
            <DateTimePicker name="deadline_at" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              Buat & Lanjut
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
