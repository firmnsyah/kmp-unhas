"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { pickLocale } from "@/shared/lib/locale";
import type { GalleryPhoto } from "@/shared/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useState } from "react";

/** Grid foto album dengan lightbox (dialog + navigasi). */
export function PhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  const locale = useLocale();
  const [index, setIndex] = useState<number | null>(null);
  const current = index !== null ? photos[index] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setIndex(i)}
            className="focus-visible:ring-ring relative aspect-square overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:outline-none"
            aria-label={pickLocale(photo.caption, locale) || `Foto ${i + 1}`}
          >
            <Image
              src={photo.image_url}
              alt={pickLocale(photo.caption, locale) || `Foto ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={current !== null} onOpenChange={(open) => !open && setIndex(null)}>
        <DialogContent className="max-w-3xl p-2 sm:p-3">
          {current ? (
            <>
              <DialogTitle className="sr-only">
                {pickLocale(current.caption, locale) || "Foto"}
              </DialogTitle>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                <Image
                  src={current.image_url}
                  alt={pickLocale(current.caption, locale) || "Foto"}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-1 pb-1">
                <p className="text-muted-foreground line-clamp-1 text-sm">
                  {pickLocale(current.caption, locale)}
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i! - 1 + photos.length) % photos.length)}
                    className="hover:bg-accent rounded-md p-2"
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i! + 1) % photos.length)}
                    className="hover:bg-accent rounded-md p-2"
                    aria-label="Berikutnya"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
