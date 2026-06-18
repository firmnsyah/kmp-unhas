import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getAlbums } from "@/modules/gallery";
import { formatDate, pickLocale } from "@/shared/lib/locale";
import { HoverLift, Reveal } from "@/shared/ui/motion";
import { EmptyState, PageHeader, Section } from "@/shared/ui/section";
import { CalendarDays, ImageIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("gallery");
  const tCommon = await getTranslations("common");
  const albums = await getAlbums();

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Section>
        {albums.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album, i) => {
              const title = pickLocale(album.title, locale);
              return (
                <Reveal key={album.id} delay={(i % 3) * 0.05} className="h-full">
                  <HoverLift className="h-full">
                    <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-md">
                      <Link href={`/galeri/${album.slug}`} className="flex h-full flex-col">
                        <div className="relative aspect-[3/2] w-full">
                          <Image
                            src={album.cover_url ?? "/images/gallery-placeholder.svg"}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="flex flex-1 flex-col gap-1.5 p-5">
                          <h3 className="font-semibold leading-snug">{title}</h3>
                          <p className="text-muted-foreground line-clamp-2 text-sm">
                            {pickLocale(album.description, locale)}
                          </p>
                          {/* Tanggal & jumlah foto menempel di bawah kartu */}
                          <div className="text-muted-foreground mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs">
                            {album.event_date ? (
                              <span className="flex items-center gap-1.5">
                                <CalendarDays className="size-3.5" />
                                {formatDate(album.event_date, locale)}
                              </span>
                            ) : null}
                            <span className="flex items-center gap-1.5">
                              <ImageIcon className="size-3.5" />
                              {t("photoCount", { count: album.photo_count ?? 0 })}
                            </span>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </HoverLift>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <EmptyState message={tCommon("emptyState")} />
        )}
      </Section>
    </>
  );
}
