import "server-only";
import { getServerSupabase } from "./supabase-server";

/** Catat aksi penting ke activity_logs (append-only, dibaca Super Admin). */
export async function logActivity(
  action: string,
  entity: string,
  entityId?: string | null,
  detail?: Record<string, unknown>,
): Promise<void> {
  const supabase = await getServerSupabase();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("activity_logs").insert({
    actor_id: user?.id ?? null,
    action,
    entity,
    entity_id: entityId ?? null,
    detail: detail ?? null,
  });
}
