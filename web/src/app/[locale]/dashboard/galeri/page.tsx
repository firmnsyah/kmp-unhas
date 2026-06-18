import { AlbumManager, getAdminAlbums } from "@/modules/gallery";

export const dynamic = "force-dynamic";

export default async function GaleriDashboardPage() {
  const albums = await getAdminAlbums();
  return (
    <AlbumManager
      albums={albums}
      title="Galeri"
      description="Kelola album dan foto kegiatan."
    />
  );
}
