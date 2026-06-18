import { getServerSupabase } from "@/shared/lib/supabase-server";
import type { Localized } from "@/shared/lib/types";

export type AdminEvent = {
  id: string;
  title: Localized;
  description: Localized | null;
  location: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  type: "proker" | "non_proker";
  department_id: string | null;
  status: "upcoming" | "done";
};

export async function getAdminEvents(): Promise<AdminEvent[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("events")
    .select("id, title, description, location, start_at, end_at, image_url, type, department_id, status")
    .order("start_at", { ascending: false });
  return (data as AdminEvent[]) ?? [];
}
