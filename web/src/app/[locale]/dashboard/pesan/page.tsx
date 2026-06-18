import { listMessages, MessageTable } from "@/modules/contact";
import { DashboardPageHeader } from "@/modules/dashboard";

export const dynamic = "force-dynamic";

export default async function PesanPage() {
  const rows = await listMessages();
  return (
    <>
      <DashboardPageHeader title="Pesan Kontak" description="Pesan masuk dari halaman kontak." />
      <MessageTable rows={rows} />
    </>
  );
}
