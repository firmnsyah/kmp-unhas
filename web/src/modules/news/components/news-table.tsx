"use client";

import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { DataTable, EmptyRow, StatusBadge } from "@/modules/dashboard";
import { formatDate } from "@/shared/lib/locale";
import { useConfirm } from "@/shared/ui/confirm-provider";
import type { NewsListItem } from "../admin-queries";
import { Pencil, Send, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteNews, submitNews } from "../admin-actions";

const STATUS: Record<NewsListItem["status"], { label: string; tone: "neutral" | "warning" | "success" | "danger" }> = {
  draft: { label: "Draf", tone: "neutral" },
  pending: { label: "Menunggu", tone: "warning" },
  published: { label: "Terbit", tone: "success" },
  rejected: { label: "Ditolak", tone: "danger" },
};

export function NewsTable({ items }: { items: NewsListItem[] }) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [pending, startTransition] = useTransition();

  async function onDelete(item: NewsListItem) {
    const ok = await confirm({
      title: "Hapus berita?",
      description: `"${item.title.id}" akan dihapus.`,
      confirmText: "Hapus",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteNews(item.id);
      if (res.ok) {
        toast.success("Berita dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal menghapus.");
    });
  }

  function onSubmit(item: NewsListItem) {
    startTransition(async () => {
      const res = await submitNews(item.id);
      if (res.ok) {
        toast.success("Berita dikirim untuk ditinjau.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal mengirim.");
    });
  }

  return (
    <DataTable
      head={
        <>
          <th>Judul</th>
          <th>Kategori</th>
          <th>Status</th>
          <th>Diperbarui</th>
          <th className="text-right">Aksi</th>
        </>
      }
    >
      {items.length ? (
        items.map((item) => (
          <tr key={item.id}>
            <td className="max-w-xs">
              <span className="line-clamp-1 font-medium">{item.title.id}</span>
              {item.status === "rejected" && item.review_note ? (
                <span className="text-destructive line-clamp-1 text-xs">Catatan: {item.review_note}</span>
              ) : null}
            </td>
            <td className="text-muted-foreground">{item.category_name?.id ?? "—"}</td>
            <td>
              <StatusBadge tone={STATUS[item.status].tone}>{STATUS[item.status].label}</StatusBadge>
            </td>
            <td className="text-muted-foreground whitespace-nowrap">
              {formatDate(item.updated_at, "id", { day: "numeric", month: "short", year: "numeric" })}
            </td>
            <td>
              <div className="flex justify-end gap-1">
                {item.status === "draft" || item.status === "rejected" ? (
                  <Button variant="ghost" size="icon" onClick={() => onSubmit(item)} disabled={pending} aria-label="Kirim untuk ditinjau">
                    <Send className="size-4" />
                  </Button>
                ) : null}
                <Button asChild variant="ghost" size="icon" aria-label="Edit">
                  <Link href={`/dashboard/berita/${item.id}`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(item)} disabled={pending} aria-label="Hapus">
                  <Trash2 className="text-destructive size-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <EmptyRow colSpan={5} message="Belum ada berita." />
      )}
    </DataTable>
  );
}
