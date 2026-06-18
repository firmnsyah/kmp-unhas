import { getServerSupabase } from "@/shared/lib/supabase-server";
import type { Profile } from "./types";

/** Profil pengguna yang sedang login, atau null bila belum login / Supabase off. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, is_active")
    .eq("id", user.id)
    .maybeSingle();
  return (data as Profile) ?? null;
}
