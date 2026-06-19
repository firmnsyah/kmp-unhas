"use server";

import { logActivity } from "@/shared/lib/activity";
import { revalidatePublic } from "@/shared/lib/revalidate";
import { slugify } from "@/shared/lib/slug";
import { getServerSupabase } from "@/shared/lib/supabase-server";
import type { Localized } from "@/shared/lib/types";
import { revalidatePath } from "next/cache";
import type { NewsPreviewPayload } from "./admin-queries";

export type AdminResult = { ok: boolean; error?: string };
export type PreviewResult = { ok: boolean; data?: NewsPreviewPayload; error?: string };

async function ctx() {
  const supabase = await getServerSupabase();
  if (!supabase) return { supabase: null, role: null, userId: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, role: null, userId: null };
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return { supabase, role: (data?.role as string) ?? null, userId: user.id };
}

const isAdmin = (role: string | null) => role === "super_admin" || role === "admin";

// Kolom author_name baru ada setelah migrasi 0003 — deteksi agar tidak error.
const isMissingAuthorCol = (msg?: string) =>
  /author_name|column .* does not exist|42703/i.test(msg ?? "");

// ===================== KATEGORI =====================
export async function saveCategory(formData: FormData): Promise<AdminResult> {
  const { supabase, role } = await ctx();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdmin(role)) return { ok: false, error: "Tidak diizinkan." };

  const id = String(formData.get("id") ?? "");
  const nameId = String(formData.get("name_id") ?? "").trim();
  const nameEn = String(formData.get("name_en") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(nameId);
  if (!nameId || !slug) return { ok: false, error: "Nama dan slug wajib diisi." };

  const payload = { name: { id: nameId, ...(nameEn ? { en: nameEn } : {}) }, slug };
  const res = id
    ? await supabase.from("news_categories").update(payload).eq("id", id)
    : await supabase.from("news_categories").insert(payload);
  if (res.error) return { ok: false, error: res.error.message };

  revalidatePath("/dashboard/kategori");
  revalidatePublic("/berita", "/berita/[slug]");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<AdminResult> {
  const { supabase, role } = await ctx();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdmin(role)) return { ok: false, error: "Tidak diizinkan." };

  const { error } = await supabase.from("news_categories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/kategori");
  return { ok: true };
}

// ===================== BERITA =====================
export async function saveNews(formData: FormData): Promise<AdminResult> {
  const { supabase, role, userId } = await ctx();
  if (!supabase || !userId) return { ok: false, error: "Sesi berakhir." };

  const id = String(formData.get("id") ?? "");
  const titleId = String(formData.get("title_id") ?? "").trim();
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const excerptId = String(formData.get("excerpt_id") ?? "").trim();
  const excerptEn = String(formData.get("excerpt_en") ?? "").trim();
  const contentId = String(formData.get("content_id") ?? "").trim();
  const contentEn = String(formData.get("content_en") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const thumbnail = String(formData.get("thumbnail_url") ?? "").trim() || null;
  const authorName = String(formData.get("author_name") ?? "").trim() || null;
  // Aksi: "save" (draf), "publish"/"submit" tergantul role
  const intent = String(formData.get("intent") ?? "save");

  if (!titleId || !contentId) return { ok: false, error: "Judul dan konten (ID) wajib diisi." };

  const loc = (idv: string, env: string) => ({ id: idv, ...(env ? { en: env } : {}) });

  // Status sesuai role & intent
  let status: string;
  if (isAdmin(role)) {
    status = intent === "publish" ? "published" : "draft";
  } else {
    status = intent === "submit" ? "pending" : "draft";
  }

  const base = {
    title: loc(titleId, titleEn),
    excerpt: excerptId ? loc(excerptId, excerptEn) : null,
    content: loc(contentId, contentEn),
    thumbnail_url: thumbnail,
    category_id: categoryId,
    author_name: authorName,
    status,
  };

  if (id) {
    // Update; slug tetap (dikunci setelah publish)
    const patch: Record<string, unknown> = { ...base };
    if (status === "published") {
      patch.published_at = new Date().toISOString();
      patch.reviewed_by = userId;
    }
    let { error } = await supabase.from("news").update(patch).eq("id", id);
    // Fallback bila kolom author_name belum ada (migrasi 0003 belum dijalankan).
    if (error && isMissingAuthorCol(error.message)) {
      delete patch.author_name;
      ({ error } = await supabase.from("news").update(patch).eq("id", id));
    }
    if (error) return { ok: false, error: error.message };
    await logActivity(`news.${intent}`, "news", id);
  } else {
    const slug = `${slugify(titleId)}-${Math.random().toString(36).slice(2, 7)}`;
    const insert: Record<string, unknown> = {
      ...base,
      slug,
      author_id: userId,
      ...(status === "published"
        ? { published_at: new Date().toISOString(), reviewed_by: userId }
        : {}),
    };
    let res = await supabase.from("news").insert(insert).select("id").single();
    if (res.error && isMissingAuthorCol(res.error.message)) {
      delete insert.author_name;
      res = await supabase.from("news").insert(insert).select("id").single();
    }
    if (res.error) return { ok: false, error: res.error.message };
    await logActivity(`news.${intent}`, "news", res.data?.id);
  }

  revalidatePath("/dashboard/berita");
  revalidatePath("/dashboard/approval");
  revalidatePublic("/", "/berita", "/berita/[slug]");
  return { ok: true };
}

// Ambil data berita untuk pratinjau (dipakai admin di halaman approval).
export async function fetchNewsPreview(id: string): Promise<PreviewResult> {
  const { supabase, role } = await ctx();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdmin(role)) return { ok: false, error: "Tidak diizinkan." };

  const withAuthor =
    "title, excerpt, content, thumbnail_url, status, author_name, category:news_categories(name), author:profiles!news_author_id_fkey(full_name)";
  const base =
    "title, excerpt, content, thumbnail_url, status, category:news_categories(name), author:profiles!news_author_id_fkey(full_name)";
  const build = (sel: string) => supabase.from("news").select(sel).eq("id", id).maybeSingle();

  let { data, error } = await build(withAuthor);
  if (error && isMissingAuthorCol(error.message)) ({ data, error } = await build(base));
  if (error || !data) return { ok: false, error: error?.message ?? "Berita tidak ditemukan." };

  type Row = {
    title: Localized;
    excerpt: Localized | null;
    content: Localized;
    thumbnail_url: string | null;
    status: string;
    author_name?: string | null;
    category: { name: Localized } | { name: Localized }[] | null;
    author: { full_name: string } | { full_name: string }[] | null;
  };
  const row = data as unknown as Row;
  const one = <T,>(v: T | T[] | null): T | null => (Array.isArray(v) ? (v[0] ?? null) : (v ?? null));
  const custom = typeof row.author_name === "string" ? row.author_name.trim() : "";

  return {
    ok: true,
    data: {
      title: row.title?.id ?? "",
      authorName: custom || one(row.author)?.full_name || "",
      categoryName: one(row.category)?.name?.id ?? null,
      thumbnailUrl: row.thumbnail_url ?? null,
      excerpt: row.excerpt?.id ?? "",
      contentHtml: row.content?.id ?? "",
      status: (row.status as NewsPreviewPayload["status"]) ?? null,
    },
  };
}

export async function submitNews(id: string): Promise<AdminResult> {
  const { supabase, userId } = await ctx();
  if (!supabase || !userId) return { ok: false, error: "Sesi berakhir." };
  const { error } = await supabase
    .from("news")
    .update({ status: "pending" })
    .eq("id", id)
    .eq("author_id", userId);
  if (error) return { ok: false, error: error.message };
  await logActivity("news.submit", "news", id);
  revalidatePath("/dashboard/berita");
  revalidatePath("/dashboard/approval");
  return { ok: true };
}

export async function deleteNews(id: string): Promise<AdminResult> {
  const { supabase, userId } = await ctx();
  if (!supabase || !userId) return { ok: false, error: "Sesi berakhir." };
  const { error } = await supabase
    .from("news")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("news.delete", "news", id);
  revalidatePath("/dashboard/berita");
  revalidatePublic("/", "/berita", "/berita/[slug]");
  return { ok: true };
}

export async function approveNews(id: string): Promise<AdminResult> {
  const { supabase, role, userId } = await ctx();
  if (!supabase || !userId) return { ok: false, error: "Sesi berakhir." };
  if (!isAdmin(role)) return { ok: false, error: "Tidak diizinkan." };
  const { error } = await supabase
    .from("news")
    .update({ status: "published", published_at: new Date().toISOString(), reviewed_by: userId, review_note: null })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("news.approve", "news", id);
  revalidatePath("/dashboard/approval");
  revalidatePublic("/", "/berita", "/berita/[slug]");
  return { ok: true };
}

export async function setCommentHidden(id: string, hidden: boolean): Promise<AdminResult> {
  const { supabase, role } = await ctx();
  if (!supabase) return { ok: false, error: "Sesi berakhir." };
  if (!isAdmin(role)) return { ok: false, error: "Tidak diizinkan." };
  const { error } = await supabase.from("news_comments").update({ is_hidden: hidden }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("comment.setHidden", "news_comments", id, { hidden });
  revalidatePath("/dashboard/komentar");
  return { ok: true };
}

export async function deleteComment(id: string): Promise<AdminResult> {
  const { supabase, role } = await ctx();
  if (!supabase) return { ok: false, error: "Sesi berakhir." };
  if (!isAdmin(role)) return { ok: false, error: "Tidak diizinkan." };
  const { error } = await supabase.from("news_comments").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("comment.delete", "news_comments", id);
  revalidatePath("/dashboard/komentar");
  return { ok: true };
}

export async function rejectNews(id: string, note: string): Promise<AdminResult> {
  const { supabase, role, userId } = await ctx();
  if (!supabase || !userId) return { ok: false, error: "Sesi berakhir." };
  if (!isAdmin(role)) return { ok: false, error: "Tidak diizinkan." };
  const { error } = await supabase
    .from("news")
    .update({ status: "rejected", review_note: note || "Perlu revisi.", reviewed_by: userId })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("news.reject", "news", id, { note });
  revalidatePath("/dashboard/approval");
  return { ok: true };
}
