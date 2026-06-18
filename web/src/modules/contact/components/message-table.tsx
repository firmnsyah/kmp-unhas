"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { DataTable, EmptyRow, StatusBadge } from "@/modules/dashboard";
import { formatDate } from "@/shared/lib/locale";
import { Mail, MailOpen } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { setMessageRead } from "../actions";
import type { ContactMessage } from "../admin-queries";

export function MessageTable({ rows }: { rows: ContactMessage[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [detail, setDetail] = useState<ContactMessage | null>(null);

  function open(msg: ContactMessage) {
    setDetail(msg);
    if (!msg.is_read) {
      startTransition(async () => {
        await setMessageRead(msg.id, true);
        router.refresh();
      });
    }
  }

  function toggleRead(msg: ContactMessage) {
    startTransition(async () => {
      const res = await setMessageRead(msg.id, !msg.is_read);
      if (res.ok) router.refresh();
      else toast.error(res.error ?? "Gagal.");
    });
  }

  return (
    <>
      <DataTable
        head={
          <>
            <th>Pengirim</th>
            <th>Subjek</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {rows.length ? (
          rows.map((msg) => (
            <tr key={msg.id} className={msg.is_read ? "" : "font-medium"}>
              <td>
                <button type="button" onClick={() => open(msg)} className="hover:text-primary text-left">
                  {msg.name}
                </button>
                <span className="text-muted-foreground block text-xs font-normal">{msg.email}</span>
              </td>
              <td>
                <button type="button" onClick={() => open(msg)} className="hover:text-primary line-clamp-1 text-left">
                  {msg.subject}
                </button>
              </td>
              <td className="text-muted-foreground whitespace-nowrap font-normal">
                {formatDate(msg.created_at, "id", { day: "numeric", month: "short", year: "numeric" })}
              </td>
              <td>
                <StatusBadge tone={msg.is_read ? "neutral" : "info"}>
                  {msg.is_read ? "Dibaca" : "Baru"}
                </StatusBadge>
              </td>
              <td>
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" onClick={() => toggleRead(msg)} disabled={pending} aria-label="Tandai dibaca">
                    {msg.is_read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={5} message="Belum ada pesan." />
        )}
      </DataTable>

      <Dialog open={detail !== null} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detail?.subject}</DialogTitle>
          </DialogHeader>
          {detail ? (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                {detail.name} &lt;{detail.email}&gt; · {formatDate(detail.created_at, "id")}
              </p>
              <p className="whitespace-pre-line">{detail.message}</p>
              <Button asChild variant="outline" size="sm">
                <a href={`mailto:${detail.email}?subject=Re: ${encodeURIComponent(detail.subject)}`}>
                  Balas via Email
                </a>
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
