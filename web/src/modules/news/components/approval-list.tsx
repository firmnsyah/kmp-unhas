"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { DataTable, EmptyRow } from "@/modules/dashboard";
import { formatDate } from "@/shared/lib/locale";
import { Check, Eye, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { approveNews, fetchNewsPreview, rejectNews } from "../admin-actions";
import type { NewsListItem, NewsPreviewPayload } from "../admin-queries";
import { NewsPreview } from "./news-preview";

export function ApprovalList({ items }: { items: NewsListItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejectTarget, setRejectTarget] = useState<NewsListItem | null>(null);
  const [note, setNote] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<NewsPreviewPayload | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  async function openPreview(item: NewsListItem) {
    setPreviewData(null);
    setPreviewLoading(true);
    setPreviewOpen(true);
    const res = await fetchNewsPreview(item.id);
    if (res.ok && res.data) setPreviewData(res.data);
    else toast.error(res.error ?? "Gagal memuat pratinjau.");
    setPreviewLoading(false);
  }

  function onApprove(item: NewsListItem) {
    startTransition(async () => {
      const res = await approveNews(item.id);
      if (res.ok) {
        toast.success("Berita dipublikasikan.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  function onReject() {
    if (!rejectTarget) return;
    startTransition(async () => {
      const res = await rejectNews(rejectTarget.id, note);
      if (res.ok) {
        toast.success("Berita ditolak dengan catatan.");
        setRejectTarget(null);
        setNote("");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  return (
    <>
      <DataTable
        head={
          <>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Dikirim</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {items.length ? (
          items.map((item) => (
            <tr key={item.id}>
              <td className="max-w-xs font-medium">
                <span className="line-clamp-1">{item.title.id}</span>
              </td>
              <td className="text-muted-foreground">{item.author_name ?? "—"}</td>
              <td className="text-muted-foreground whitespace-nowrap">
                {formatDate(item.updated_at, "id", { day: "numeric", month: "short", year: "numeric" })}
              </td>
              <td>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openPreview(item)} disabled={pending}>
                    <Eye className="size-4" />
                    Pratinjau
                  </Button>
                  <Button size="sm" onClick={() => onApprove(item)} disabled={pending}>
                    <Check className="size-4" />
                    Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRejectTarget(item)}
                    disabled={pending}
                  >
                    <X className="size-4" />
                    Tolak
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={4} message="Tidak ada berita menunggu persetujuan." />
        )}
      </DataTable>

      <Dialog open={rejectTarget !== null} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Berita</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="note">Catatan Revisi</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Jelaskan apa yang perlu diperbaiki..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={onReject} disabled={pending}>
              Tolak Berita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NewsPreview open={previewOpen} onOpenChange={setPreviewOpen} data={previewData} loading={previewLoading} />
    </>
  );
}
