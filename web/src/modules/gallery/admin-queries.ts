import { getServerSupabase } from "@/shared/lib/supabase-server";
import type { GalleryAlbum, GalleryPhoto } from "@/shared/lib/types";

type AlbumRow = GalleryAlbum & { photos: { count: number }[] };

export async function getAdminAlbums(): Promise<GalleryAlbum[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("gallery_albums")
    .select("*, photos:gallery_photos(count)")
    .order("event_date", { ascending: false });
  return ((data as AlbumRow[]) ?? []).map(({ photos, ...album }) => ({
    ...album,
    photo_count: photos?.[0]?.count ?? 0,
  }));
}

export async function getAdminAlbum(
  id: string,
): Promise<(GalleryAlbum & { photos: GalleryPhoto[] }) | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("gallery_albums")
    .select("*, photos:gallery_photos(*)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const album = data as GalleryAlbum & { photos: GalleryPhoto[] };
  return { ...album, photos: [...album.photos].sort((a, b) => a.sort_order - b.sort_order) };
}
