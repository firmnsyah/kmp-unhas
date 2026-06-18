import { getServerSupabase } from "@/shared/lib/supabase-server";

export type RegistrationStatus = "baru" | "dihubungi" | "diterima" | "ditolak";

export type Registration = {
  id: string;
  full_name: string;
  nim: string;
  faculty: string;
  major: string;
  batch: string;
  origin: string;
  email: string;
  whatsapp: string;
  reason: string;
  status: RegistrationStatus;
  created_at: string;
};

export async function listRegistrations(): Promise<Registration[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Registration[]) ?? [];
}
