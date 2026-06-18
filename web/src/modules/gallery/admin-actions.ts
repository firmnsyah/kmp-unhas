"use server";

import { logActivity } from "@/shared/lib/activity";
import { getAdminContext, isAdminRole } from "@/shared/lib/admin-guard";
import { slugify } from "@/shared/lib/slug";
import { revalidatePath } from "next/cache";

export type GalleryResult = { ok: boolean; error?: string };

function revalidateGallery() {
  revalidatePath("/dashboard/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
}

export async function saveAlbum(formData: FormData): Promise<GalleryResult> {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };

  const id = String(formData.get("id") ?? "");
  const titleId = String(formData.get("title_id") ?? "").trim();
  const descId = String(formData.get("description_id") ?? "").trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim() || null;
  const eventDate = String(formData.get("event_date") ?? "") || null;
  const slug = String(formData.get("slug") ?? "").trim() || slugify(titleId);
  if (!titleId || !slug) return { ok: false, error: "Judul album wajib diisi." };

  const payload = {
    title: { id: titleId },
    description: descId ? { id: descId } : null,
    cover_url: coverUrl,
    event_date: eventDate,
    slug,
  };
  const res = id
    ? await supabase.from("gallery_albums").update(payload).eq("id", id)
    : await supabase.from("gallery_albums").insert(payload);
  if (res.error) return { ok: false, error: res.error.message };

  await logActivity(id ? "album.update" : "album.create", "gallery_albums", id || undefined);
  revalidateGallery();
  return { ok: true };
}

export async function deleteAlbum(id: string): Promise<GalleryResult> {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };
  const { error } = await supabase.from("gallery_albums").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("album.delete", "gallery_albums", id);
  revalidateGallery();
  return { ok: true };
}

export async function addPhoto(formData: FormData): Promise<GalleryResult> {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };

  const albumId = String(formData.get("album_id") ?? "");
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const captionId = String(formData.get("caption_id") ?? "").trim();
  if (!albumId || !imageUrl) return { ok: false, error: "Gambar wajib diunggah." };

  const { error } = await supabase.from("gallery_photos").insert({
    album_id: albumId,
    image_url: imageUrl,
    caption: captionId ? { id: captionId } : null,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/galeri/${albumId}`);
  revalidatePath("/galeri");
  return { ok: true };
}

export async function deletePhoto(id: string, albumId: string): Promise<GalleryResult> {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };
  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/galeri/${albumId}`);
  revalidatePath("/galeri");
  return { ok: true };
}
