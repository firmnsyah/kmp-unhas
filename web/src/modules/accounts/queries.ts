import type { UserRole } from "@/modules/auth/types";
import { getServerSupabase } from "@/shared/lib/supabase-server";

export type AccountRow = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

/** Daftar akun internal sesuai cakupan: super admin → semua internal; admin → panitia. */
export async function listAccounts(scope: UserRole): Promise<AccountRow[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const roles = scope === "super_admin" ? ["super_admin", "admin", "panitia"] : ["panitia"];
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, is_active, created_at")
    .in("role", roles)
    .order("created_at", { ascending: false });
  return (data as AccountRow[]) ?? [];
}
