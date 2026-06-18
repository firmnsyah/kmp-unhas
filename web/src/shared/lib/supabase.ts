import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Supabase terkonfigurasi? Jika tidak, app berjalan dengan data demo (fallback). */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/**
 * Client anon untuk baca data publik & insert form publik (dilindungi RLS).
 * Tanpa cookie/session — aman dipakai saat SSG/ISR.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  client ??= createClient(url!, anonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/**
 * Jalankan query Supabase dengan fallback data demo:
 * - Supabase belum dikonfigurasi → fallback (pengalaman dev pertama kali).
 * - Query error → lempar error (jangan menutupi masalah nyata).
 */
export async function queryOrFallback<T>(
  fallback: T,
  run: (db: SupabaseClient) => PromiseLike<{ data: unknown; error: { message: string } | null }>,
  transform: (data: never) => T,
): Promise<T> {
  const db = getSupabase();
  if (!db) return fallback;
  const { data, error } = await run(db);
  if (error) throw new Error(`Supabase query gagal: ${error.message}`);
  return transform(data as never);
}
