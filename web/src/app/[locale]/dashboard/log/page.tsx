import { listActivityLogs } from "@/modules/activity-log";
import { DashboardPageHeader, DataTable, EmptyRow } from "@/modules/dashboard";
import { formatDate } from "@/shared/lib/locale";

export const dynamic = "force-dynamic";

export default async function LogPage() {
  const rows = await listActivityLogs();
  return (
    <>
      <DashboardPageHeader title="Log Aktivitas" description="Riwayat aksi penting di dashboard." />
      <DataTable
        head={
          <>
            <th>Waktu</th>
            <th>Aktor</th>
            <th>Aksi</th>
            <th>Entitas</th>
          </>
        }
      >
        {rows.length ? (
          rows.map((r) => (
            <tr key={r.id}>
              <td className="text-muted-foreground whitespace-nowrap">
                {formatDate(r.created_at, "id", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td>{r.actor_name ?? "—"}</td>
              <td>
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{r.action}</code>
              </td>
              <td className="text-muted-foreground">{r.entity}</td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={4} message="Belum ada aktivitas tercatat." />
        )}
      </DataTable>
    </>
  );
}
