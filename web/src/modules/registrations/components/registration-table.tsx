"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { DashboardPageHeader, DataTable, EmptyRow } from "@/modules/dashboard";
import { formatDate } from "@/shared/lib/locale";
import { Download, Eye } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setRegistrationStatus } from "../actions";
import type { Registration, RegistrationStatus } from "../queries";

const STATUSES: RegistrationStatus[] = ["baru", "dihubungi", "diterima", "ditolak"];
const STATUS_LABEL: Record<RegistrationStatus, string> = {
  baru: "Baru",
  dihubungi: "Dihubungi",
  diterima: "Diterima",
  ditolak: "Ditolak",
};

function toCsv(rows: Registration[]): string {
  const headers = [
    "Nama",
    "NIM",
    "Fakultas",
    "Prodi",
    "Angkatan",
    "Asal",
    "Email",
    "WhatsApp",
    "Alasan",
    "Status",
    "Tanggal",
  ];
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      r.full_name,
      r.nim,
      r.faculty,
      r.major,
      r.batch,
      r.origin,
      r.email,
      r.whatsapp,
      r.reason,
      STATUS_LABEL[r.status],
      new Date(r.created_at).toLocaleDateString("id-ID"),
    ]
      .map(escape)
      .join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

export function RegistrationTable({
  rows,
  title,
  description,
}: {
  rows: Registration[];
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [detail, setDetail] = useState<Registration | null>(null);

  function changeStatus(r: Registration, status: RegistrationStatus) {
    startTransition(async () => {
      const res = await setRegistrationStatus(r.id, status);
      if (res.ok) {
        toast.success("Status diperbarui.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  function exportCsv() {
    const blob = new Blob(["﻿" + toCsv(rows)], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pendaftar-kmp-unhas.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          <Button variant="outline" onClick={exportCsv} disabled={!rows.length}>
            <Download className="size-4" />
            Unduh CSV
          </Button>
        }
      />

      <DataTable
        head={
          <>
            <th>Nama</th>
            <th>NIM</th>
            <th>Prodi</th>
            <th>Angkatan</th>
            <th>Status</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {rows.length ? (
          rows.map((r) => (
            <tr key={r.id}>
              <td className="font-medium">{r.full_name}</td>
              <td className="text-muted-foreground">{r.nim}</td>
              <td className="text-muted-foreground">{r.major}</td>
              <td className="text-muted-foreground">{r.batch}</td>
              <td>
                <Select
                  value={r.status}
                  onValueChange={(v) => changeStatus(r, v as RegistrationStatus)}
                  disabled={pending}
                >
                  <SelectTrigger size="sm" className="w-auto text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td>
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" onClick={() => setDetail(r)} aria-label="Detail">
                    <Eye className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={6} message="Belum ada pendaftar." />
        )}
      </DataTable>

      <Dialog open={detail !== null} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Pendaftar</DialogTitle>
          </DialogHeader>
          {detail ? (
            <dl className="space-y-2 text-sm">
              {[
                ["Nama", detail.full_name],
                ["NIM", detail.nim],
                ["Fakultas", detail.faculty],
                ["Program Studi", detail.major],
                ["Angkatan", detail.batch],
                ["Asal", detail.origin],
                ["Email", detail.email],
                ["WhatsApp", detail.whatsapp],
                ["Alasan", detail.reason],
                ["Tanggal", formatDate(detail.created_at, "id")],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="col-span-2">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
