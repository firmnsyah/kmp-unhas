import { DashboardPageHeader } from "@/modules/dashboard";
import { ApprovalList, getPendingNews } from "@/modules/news";

export const dynamic = "force-dynamic";

export default async function ApprovalPage() {
  const items = await getPendingNews();
  return (
    <>
      <DashboardPageHeader
        title="Approval Berita"
        description="Tinjau dan setujui berita yang dikirim panitia."
      />
      <ApprovalList items={items} />
    </>
  );
}
