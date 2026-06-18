import { FALLBACK_CATEGORIES, FALLBACK_NEWS } from "@/shared/config/fallback-content";
import { pickLocale } from "@/shared/lib/locale";
import { getSupabase, queryOrFallback } from "@/shared/lib/supabase";
import type { News, NewsCategory } from "@/shared/lib/types";

export const NEWS_PER_PAGE = 9;

// supabase-js mengetik relasi ter-embed sebagai array dan saat runtime relasi
// to-one bisa berupa objek tunggal ATAU array satu elemen — jadi normalisasikan.
type Embed<T> = T | T[] | null;
type NewsRow = {
  id: string;
  title: News["title"];
  slug: string;
  excerpt: News["excerpt"];
  content: News["content"];
  thumbnail_url: string | null;
  published_at: string;
  category: Embed<NewsCategory>;
  author: Embed<{ full_name: string }>;
  author_name?: string | null;
};

const one = <T>(value: Embed<T>): T | null =>
  Array.isArray(value) ? (value[0] ?? null) : (value ?? null);

// news punya 2 FK ke profiles (author_id & reviewed_by) → wajib sebutkan FK-nya.
const NEWS_SELECT_BASE =
  "id, title, slug, excerpt, content, thumbnail_url, published_at, category:news_categories(id, name, slug), author:profiles!news_author_id_fkey(full_name)";
// Kolom author_name (kustom) — perlu migrasi 0003. Dipakai di halaman detail.
const NEWS_SELECT = `${NEWS_SELECT_BASE}, author_name`;
// Sebelum migrasi 0003 dijalankan, kolom author_name belum ada → jangan error.
const isMissingAuthorCol = (e: { message?: string } | null) =>
  /author_name|42703|column .* does not exist/i.test(e?.message ?? "");

function mapNews(row: NewsRow): News {
  // author_name kustom diutamakan; fallback ke nama profil akun penulis.
  const custom = typeof row.author_name === "string" ? row.author_name.trim() : "";
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    thumbnail_url: row.thumbnail_url,
    published_at: row.published_at,
    category: one(row.category),
    author_name: custom || one(row.author)?.full_name || null,
  };
}

export async function getCategories(): Promise<NewsCategory[]> {
  return queryOrFallback(
    FALLBACK_CATEGORIES,
    (db) => db.from("news_categories").select("id, name, slug").order("slug"),
    (rows: NewsCategory[]) => rows,
  );
}

export type NewsListParams = {
  locale: string;
  category?: string; // slug kategori
  q?: string;
  page?: number;
};

export async function getNewsList({ locale, category, q, page = 1 }: NewsListParams): Promise<{
  items: News[];
  total: number;
  totalPages: number;
}> {
  const from = (page - 1) * NEWS_PER_PAGE;
  const pageOf = (items: News[], total: number) => ({
    items,
    total,
    totalPages: Math.max(1, Math.ceil(total / NEWS_PER_PAGE)),
  });

  const db = getSupabase();
  if (!db) {
    let items = FALLBACK_NEWS;
    if (category) items = items.filter((n) => n.category?.slug === category);
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter(
        (n) =>
          pickLocale(n.title, locale).toLowerCase().includes(needle) ||
          pickLocale(n.excerpt, locale).toLowerCase().includes(needle),
      );
    }
    return pageOf(items.slice(from, from + NEWS_PER_PAGE), items.length);
  }

  // Filter via FK category_id: memfilter berdasarkan kolom tabel ter-embed
  // di PostgREST butuh inner join dan rawan salah, jadi resolusikan slug → id.
  let categoryId: string | undefined;
  if (category) {
    const { data: cat } = await db
      .from("news_categories")
      .select("id")
      .eq("slug", category)
      .maybeSingle();
    if (!cat) return pageOf([], 0);
    categoryId = cat.id;
  }

  let query = db
    .from("news")
    .select(NEWS_SELECT_BASE, { count: "exact" })
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .range(from, from + NEWS_PER_PAGE - 1);
  if (categoryId) query = query.eq("category_id", categoryId);
  if (q) {
    // Bersihkan karakter yang punya makna khusus di string filter PostgREST.
    const safe = q.replace(/[,()*%\\]/g, " ").trim();
    if (safe) query = query.or(`title->>id.ilike.%${safe}%,title->>en.ilike.%${safe}%`);
  }

  const { data, count, error } = await query;
  if (error) throw new Error(`Supabase query gagal: ${error.message}`);
  return pageOf((data as NewsRow[] | null)?.map(mapNews) ?? [], count ?? 0);
}

export async function getLatestNews(limit = 3): Promise<News[]> {
  return queryOrFallback(
    FALLBACK_NEWS.slice(0, limit),
    (db) =>
      db
        .from("news")
        .select(NEWS_SELECT_BASE)
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(limit),
    (rows: NewsRow[]) => rows.map(mapNews),
  );
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const db = getSupabase();
  if (!db) return FALLBACK_NEWS.find((n) => n.slug === slug) ?? null;

  const build = (select: string) =>
    db
      .from("news")
      .select(select)
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

  let { data, error } = await build(NEWS_SELECT);
  // Fallback bila kolom author_name belum ada (migrasi 0003 belum dijalankan).
  if (error && isMissingAuthorCol(error)) ({ data, error } = await build(NEWS_SELECT_BASE));
  if (error) throw new Error(`Supabase query gagal: ${error.message}`);
  return data ? mapNews(data as unknown as NewsRow) : null;
}

export async function getRelatedNews(news: News, limit = 3): Promise<News[]> {
  const fallback = FALLBACK_NEWS.filter(
    (n) => n.id !== news.id && n.category?.slug === news.category?.slug,
  ).slice(0, limit);

  if (!news.category) return fallback;
  return queryOrFallback(
    fallback,
    (db) =>
      db
        .from("news")
        .select(NEWS_SELECT_BASE)
        .eq("status", "published")
        .is("deleted_at", null)
        .eq("category_id", news.category!.id)
        .neq("id", news.id)
        .order("published_at", { ascending: false })
        .limit(limit),
    (rows: NewsRow[]) => rows.map(mapNews),
  );
}
