"use server";

import { logActivity } from "@/shared/lib/activity";
import { getAdminContext, isSuperAdmin } from "@/shared/lib/admin-guard";
import { revalidatePath } from "next/cache";

export type CmsResult = { ok: boolean; error?: string };

/** Simpan satu section konten ke site_content (Super Admin). Revalidasi semua halaman publik. */
export async function saveSiteContent(key: string, value: unknown): Promise<CmsResult> {
  const { supabase, role, userId } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isSuperAdmin(role)) return { ok: false, error: "Hanya Super Admin." };

  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_by: userId, updated_at: new Date().toISOString() });
  if (error) return { ok: false, error: error.message };

  await logActivity("cms.save", "site_content", key);
  revalidatePath("/", "layout");
  return { ok: true };
}
