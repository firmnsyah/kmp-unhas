import { FALLBACK_EVENTS } from "@/shared/config/fallback-content";
import { queryOrFallback } from "@/shared/lib/supabase";
import type { OrgEvent } from "@/shared/lib/types";

type EventRow = Omit<OrgEvent, "department_name"> & {
  department: { name: OrgEvent["department_name"] } | null;
};

const EVENT_SELECT =
  "id, title, description, location, start_at, end_at, image_url, type, status, department:departments(name)";

function mapEvent(row: EventRow): OrgEvent {
  return { ...row, department_name: row.department?.name ?? null };
}

export type EventFilter = {
  status: "upcoming" | "done";
  type?: "proker" | "non_proker";
};

export async function getEvents({ status, type }: EventFilter): Promise<OrgEvent[]> {
  let fallback = FALLBACK_EVENTS.filter((e) => e.status === status);
  if (type) fallback = fallback.filter((e) => e.type === type);
  fallback.sort((a, b) =>
    status === "upcoming"
      ? a.start_at.localeCompare(b.start_at)
      : b.start_at.localeCompare(a.start_at),
  );

  return queryOrFallback(
    fallback,
    (db) => {
      let query = db
        .from("events")
        .select(EVENT_SELECT)
        .eq("status", status)
        .order("start_at", { ascending: status === "upcoming" });
      if (type) query = query.eq("type", type);
      return query;
    },
    (rows: EventRow[]) => rows.map(mapEvent),
  );
}

export async function getUpcomingEvents(limit = 3): Promise<OrgEvent[]> {
  const events = await getEvents({ status: "upcoming" });
  return events.slice(0, limit);
}
