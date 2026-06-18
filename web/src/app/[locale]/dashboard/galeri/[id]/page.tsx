import { getAdminAlbum, PhotoManager } from "@/modules/gallery";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AlbumPhotosPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const album = await getAdminAlbum(id);
  if (!album) notFound();

  return <PhotoManager albumId={album.id} albumTitle={album.title.id} photos={album.photos} />;
}
