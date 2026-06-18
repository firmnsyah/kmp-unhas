import { getServerSupabase } from "@/shared/lib/supabase-server";

export type LogRow = {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  created_at: string;
  actor_name: string | null;
};

type RawLog = Omit<LogRow, "actor_name"> & {
  actor: { full_name: string } | { full_name: string }[] | null;
};

export async function listActivityLogs(): Promise<LogRow[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("activity_logs")
    .select("id, action, entity, entity_id, created_at, actor:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(200);
  return ((data as RawLog[]) ?? []).map((r) => {
    const actor = Array.isArray(r.actor) ? r.actor[0] : r.actor;
    return {
      id: r.id,
      action: r.action,
      entity: r.entity,
      entity_id: r.entity_id,
      created_at: r.created_at,
      actor_name: actor?.full_name ?? null,
    };
  });
}
