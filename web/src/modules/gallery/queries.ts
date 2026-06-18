import { FALLBACK_ALBUMS, FALLBACK_ALBUM_PHOTOS } from "@/shared/config/fallback-content";
import { queryOrFallback } from "@/shared/lib/supabase";
import type { GalleryAlbum, GalleryPhoto } from "@/shared/lib/types";

type AlbumRow = GalleryAlbum & { photos: { count: number }[] };

export async function getAlbums(limit?: number): Promise<GalleryAlbum[]> {
  const fallback = limit ? FALLBACK_ALBUMS.slice(0, limit) : FALLBACK_ALBUMS;
  return queryOrFallback(
    fallback,
    (db) => {
      let query = db
        .from("gallery_albums")
        .select("*, photos:gallery_photos(count)")
        .order("event_date", { ascending: false });
      if (limit) query = query.limit(limit);
      return query;
    },
    (rows: AlbumRow[]) =>
      rows.map(({ photos, ...album }) => ({
        ...album,
        photo_count: photos?.[0]?.count ?? 0,
      })),
  );
}

export async function getAlbumBySlug(
  slug: string,
): Promise<(GalleryAlbum & { photos: GalleryPhoto[] }) | null> {
  const album = FALLBACK_ALBUMS.find((a) => a.slug === slug);
  const fallback = album ? { ...album, photos: FALLBACK_ALBUM_PHOTOS[slug] ?? [] } : null;

  return queryOrFallback(
    fallback,
    (db) =>
      db
        .from("gallery_albums")
        .select("*, photos:gallery_photos(*)")
        .eq("slug", slug)
        .maybeSingle(),
    (row: (GalleryAlbum & { photos: GalleryPhoto[] }) | null) =>
      row
        ? { ...row, photos: [...row.photos].sort((a, b) => a.sort_order - b.sort_order) }
        : null,
  );
}

/** Foto terbaru lintas album untuk preview beranda. */
export async function getRecentPhotos(limit = 8): Promise<GalleryPhoto[]> {
  const fallback = Object.values(FALLBACK_ALBUM_PHOTOS).flat().slice(0, limit);
  return queryOrFallback(
    fallback,
    (db) =>
      db
        .from("gallery_photos")
        .select("id, image_url, caption, sort_order")
        .order("id", { ascending: false })
        .limit(limit),
    (rows: GalleryPhoto[]) => rows,
  );
}
