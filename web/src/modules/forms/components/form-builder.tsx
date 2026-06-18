"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Link, useRouter } from "@/i18n/navigation";
import { DataTable, EmptyRow } from "@/modules/dashboard";
import { DateTimePicker } from "@/shared/ui/date-time-picker";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { ImageUpload } from "@/shared/ui/image-upload";
import { ArrowLeft, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteQuestion, saveForm, saveQuestion } from "../admin-actions";
import { QUESTION_TYPE_LABEL, type DynamicForm, type FormQuestion, type QuestionType } from "../types";

const NEEDS_OPTIONS: QuestionType[] = ["radio", "checkbox", "dropdown"];

export function FormBuilder({
  form,
  questions,
}: {
  form: DynamicForm;
  questions: FormQuestion[];
}) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [pending, startTransition] = useTransition();
  const [qOpen, setQOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<FormQuestion | null>(null);
  const [qType, setQType] = useState<QuestionType>("short_text");

  function saveMeta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveForm(formData);
      if (res.ok) {
        toast.success("Pengaturan form disimpan.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  function submitQuestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveQuestion(formData);
      if (res.ok) {
        toast.success("Pertanyaan disimpan.");
        setQOpen(false);
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  async function removeQuestion(q: FormQuestion) {
    const ok = await confirm({ title: "Hapus pertanyaan ini?", confirmText: "Hapus", destructive: true });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteQuestion(q.id, form.id);
      if (res.ok) {
        toast.success("Pertanyaan dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  const shareLink = typeof window !== "undefined" ? `${window.location.origin}/form/${form.slug}` : `/form/${form.slug}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/form">
            <ArrowLeft className="size-4" />
            Semua Form
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(shareLink); toast.success("Link disalin."); }}>
          Salin Link Form
        </Button>
      </div>

      {/* Pengaturan form */}
      <Card>
        <CardContent>
          <form onSubmit={saveMeta} className="space-y-4">
            <input type="hidden" name="id" value={form.id} />
            <h2 className="font-semibold">Pengaturan Form</h2>
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" name="title" defaultValue={form.title.id} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" name="description" defaultValue={form.description?.id} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <DateTimePicker name="deadline_at" defaultValue={form.deadline_at} />
            </div>
            <div className="space-y-2">
              <Label>Banner (opsional)</Label>
              <ImageUpload name="banner_url" defaultValue={form.banner_url} bucket="forms" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" defaultChecked={form.is_active} className="accent-primary size-4" /> Aktif
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="show_on_home" defaultChecked={form.show_on_home} className="accent-primary size-4" /> Tampilkan di beranda
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="one_response_per_user" defaultChecked={form.one_response_per_user} className="accent-primary size-4" /> Satu respons per user
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="allow_edit_response" defaultChecked={form.allow_edit_response} className="accent-primary size-4" /> Boleh edit respons
              </label>
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Simpan Pengaturan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pertanyaan */}
      <Dialog open={qOpen} onOpenChange={setQOpen}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pertanyaan</h2>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditingQ(null); setQType("short_text"); }}>
              <Plus className="size-4" />
              Tambah Pertanyaan
            </Button>
          </DialogTrigger>
        </div>

        <DataTable
          head={
            <>
              <th>Pertanyaan</th>
              <th>Tipe</th>
              <th>Wajib</th>
              <th className="text-right">Aksi</th>
            </>
          }
        >
          {questions.length ? (
            questions.map((q) => (
              <tr key={q.id}>
                <td className="font-medium">{q.label.id}</td>
                <td className="text-muted-foreground">{QUESTION_TYPE_LABEL[q.type]}</td>
                <td className="text-muted-foreground">{q.is_required ? "Ya" : "Tidak"}</td>
                <td>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingQ(q); setQType(q.type); setQOpen(true); }} aria-label="Edit">
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeQuestion(q)} aria-label="Hapus">
                      <Trash2 className="text-destructive size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <EmptyRow colSpan={4} message="Belum ada pertanyaan." />
          )}
        </DataTable>

        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQ ? "Edit Pertanyaan" : "Tambah Pertanyaan"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitQuestion} className="space-y-4">
            <input type="hidden" name="form_id" value={form.id} />
            {editingQ ? <input type="hidden" name="id" value={editingQ.id} /> : null}
            <div className="space-y-2">
              <Label htmlFor="q-label">Label Pertanyaan</Label>
              <Input id="q-label" name="label" defaultValue={editingQ?.label.id} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="q-type">Tipe</Label>
                <Select value={qType} onValueChange={(v) => setQType(v as QuestionType)} name="type">
                  <SelectTrigger id="q-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(QUESTION_TYPE_LABEL) as QuestionType[]).map((t) => (
                      <SelectItem key={t} value={t}>
                        {QUESTION_TYPE_LABEL[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-sort">Urutan</Label>
                <Input id="q-sort" name="sort_order" type="number" defaultValue={editingQ?.sort_order ?? questions.length} />
              </div>
            </div>
            {NEEDS_OPTIONS.includes(qType) ? (
              <div className="space-y-2">
                <Label htmlFor="q-options">Pilihan (satu per baris)</Label>
                <Textarea id="q-options" name="options" defaultValue={editingQ?.options?.join("\n")} rows={4} />
              </div>
            ) : null}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_required" defaultChecked={editingQ?.is_required} className="accent-primary size-4" /> Wajib diisi
            </label>
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
