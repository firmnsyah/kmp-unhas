import { EventManager, getAdminEvents } from "@/modules/events";
import { getDepartments } from "@/modules/organization";

export const dynamic = "force-dynamic";

export default async function AgendaDashboardPage() {
  const [events, departments] = await Promise.all([getAdminEvents(), getDepartments()]);
  return (
    <EventManager
      events={events}
      departments={departments}
      title="Agenda"
      description="Kelola kegiatan dan program kerja organisasi."
    />
  );
}
