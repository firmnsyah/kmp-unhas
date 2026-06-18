"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarDays, Loader2, UserRound } from "lucide-react";
import type { NewsPreviewPayload } from "../admin-queries";

export function NewsPreview({
  open,
  onOpenChange,
  data,
  loading,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: NewsPreviewPayload | null;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pratinjau Berita</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-muted-foreground flex items-center gap-2 py-10">
            <Loader2 className="size-4 animate-spin" /> Memuat pratinjau...
          </p>
        ) : data ? (
          <article className="pb-2">
            <div className="space-y-3">
              {data.categoryName ? <Badge>{data.categoryName}</Badge> : null}
              <h1 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">
                {data.title || "Tanpa judul"}
              </h1>
              {data.excerpt ? (
                <p className="text-muted-foreground">{data.excerpt}</p>
              ) : null}
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="flex items-center gap-1.5">
                  <UserRound className="size-4" />
                  {data.authorName || "Tim Redaksi KMP-UNHAS"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  Pratinjau (belum dipublikasikan)
                </span>
              </div>
            </div>

            {data.thumbnailUrl ? (
              <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.thumbnailUrl} alt={data.title} className="absolute inset-0 size-full object-cover" />
              </div>
            ) : null}

            <div
              className="prose prose-neutral dark:prose-invert mt-6 max-w-none [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: data.contentHtml || "<p><em>Konten masih kosong.</em></p>" }}
            />
          </article>
        ) : (
          <p className="text-muted-foreground py-10">Tidak ada data untuk ditampilkan.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
