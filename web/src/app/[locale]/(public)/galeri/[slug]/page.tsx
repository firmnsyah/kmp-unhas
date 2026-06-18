import { getAlbumBySlug, getAlbums, PhotoGrid } from "@/modules/gallery";
import { formatDate, pickLocale } from "@/shared/lib/locale";
import { Reveal } from "@/shared/ui/motion";
import { PageHeader, Section } from "@/shared/ui/section";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const albums = await getAlbums();
  return albums.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) return {};
  return {
    title: pickLocale(album.title, locale),
    description: pickLocale(album.description, locale),
  };
}

export default async function AlbumDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  const subtitle = [
    pickLocale(album.description, locale),
    album.event_date ? formatDate(album.event_date, locale) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PageHeader title={pickLocale(album.title, locale)} subtitle={subtitle} />
      <Section>
        <Reveal>
          <PhotoGrid photos={album.photos} />
        </Reveal>
      </Section>
    </>
  );
}
