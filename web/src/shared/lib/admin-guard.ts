import "server-only";
import { getServerSupabase } from "./supabase-server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminContext = {
  supabase: SupabaseClient | null;
  role: string | null;
  userId: string | null;
};

/** Konteks pengguna saat ini untuk Server Actions admin. */
export async function getAdminContext(): Promise<AdminContext> {
  const supabase = await getServerSupabase();
  if (!supabase) return { supabase: null, role: null, userId: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, role: null, userId: null };
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return { supabase, role: (data?.role as string) ?? null, userId: user.id };
}

export const isAdminRole = (role: string | null) =>
  role === "super_admin" || role === "admin";
export const isSuperAdmin = (role: string | null) => role === "super_admin";
