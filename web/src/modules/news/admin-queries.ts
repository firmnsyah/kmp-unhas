import { getServerSupabase } from "@/shared/lib/supabase-server";
import type { Localized } from "@/shared/lib/types";

export type AdminNewsRow = {
  id: string;
  title: Localized;
  slug: string;
  status: "draft" | "pending" | "published" | "rejected";
  published_at: string | null;
  updated_at: string;
  review_note: string | null;
  category: { name: Localized } | { name: Localized }[] | null;
  author: { full_name: string } | { full_name: string }[] | null;
};

function one<T>(v: T | T[] | null): T | null {
  return Array.isArray(v) ? (v[0] ?? null) : (v ?? null);
}

// news punya 2 FK ke profiles (author_id & reviewed_by) → sebutkan FK author.
const LIST_SELECT =
  "id, title, slug, status, published_at, updated_at, review_note, category:news_categories(name), author:profiles!news_author_id_fkey(full_name)";

export type NewsListItem = {
  id: string;
  title: Localized;
  slug: string;
  status: AdminNewsRow["status"];
  published_at: string | null;
  updated_at: string;
  review_note: string | null;
  category_name: Localized | null;
  author_name: string | null;
};

function mapRow(r: AdminNewsRow): NewsListItem {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    status: r.status,
    published_at: r.published_at,
    updated_at: r.updated_at,
    review_note: r.review_note,
    category_name: one(r.category)?.name ?? null,
    author_name: one(r.author)?.full_name ?? null,
  };
}

export async function getAdminNewsList(ownerId?: string): Promise<NewsListItem[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  let query = supabase
    .from("news")
    .select(LIST_SELECT)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  if (ownerId) query = query.eq("author_id", ownerId);
  const { data } = await query;
  return ((data as AdminNewsRow[]) ?? []).map(mapRow);
}

export async function getPendingNews(): Promise<NewsListItem[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("news")
    .select(LIST_SELECT)
    .eq("status", "pending")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  return ((data as AdminNewsRow[]) ?? []).map(mapRow);
}

export type NewsEditData = {
  id: string;
  title: Localized;
  excerpt: Localized | null;
  content: Localized;
  thumbnail_url: string | null;
  category_id: string | null;
  author_name: string | null;
  status: AdminNewsRow["status"];
};

export async function getNewsForEdit(id: string): Promise<NewsEditData | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const build = (sel: string) => supabase.from("news").select(sel).eq("id", id).maybeSingle();
  const first = await build(
    "id, title, excerpt, content, thumbnail_url, category_id, status, author_name",
  );
  // Fallback bila kolom author_name belum ada (migrasi 0003 belum dijalankan).
  const data = first.error
    ? (await build("id, title, excerpt, content, thumbnail_url, category_id, status")).data
    : first.data;
  return (data as unknown as NewsEditData) ?? null;
}

export type NewsPreviewPayload = {
  title: string;
  authorName: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  excerpt: string;
  contentHtml: string;
  status: AdminNewsRow["status"] | null;
};

export type CommentRow = {
  id: string;
  content: string;
  is_hidden: boolean;
  created_at: string;
  author_name: string | null;
  news_title: Localized | null;
};

type RawComment = {
  id: string;
  content: string;
  is_hidden: boolean;
  created_at: string;
  author: { full_name: string } | { full_name: string }[] | null;
  news: { title: Localized } | { title: Localized }[] | null;
};

export async function listComments(): Promise<CommentRow[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  // news_comments punya 2 FK ke profiles (user_id & reply_to_user_id) → sebutkan FK.
  const { data } = await supabase
    .from("news_comments")
    .select(
      "id, content, is_hidden, created_at, author:profiles!news_comments_user_id_fkey(full_name), news:news(title)",
    )
    .order("created_at", { ascending: false })
    .limit(200);
  return ((data as RawComment[]) ?? []).map((r) => ({
    id: r.id,
    content: r.content,
    is_hidden: r.is_hidden,
    created_at: r.created_at,
    author_name: one(r.author)?.full_name ?? null,
    news_title: one(r.news)?.title ?? null,
  }));
}
