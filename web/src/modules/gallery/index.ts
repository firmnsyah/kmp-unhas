// Public API modul galeri
export { PhotoGrid } from "./components/photo-grid";
export { getAlbumBySlug, getAlbums, getRecentPhotos } from "./queries";

// --- Dashboard (admin) ---
export { addPhoto, deleteAlbum, deletePhoto, saveAlbum } from "./admin-actions";
export { getAdminAlbum, getAdminAlbums } from "./admin-queries";
export { AlbumManager } from "./components/album-manager";
export { PhotoManager } from "./components/photo-manager";
