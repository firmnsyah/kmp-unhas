import { DashboardPageHeader } from "@/modules/dashboard";
import { CommentTable, listComments } from "@/modules/news";

export const dynamic = "force-dynamic";

export default async function KomentarPage() {
  const rows = await listComments();
  return (
    <>
      <DashboardPageHeader
        title="Moderasi Komentar"
        description="Kelola komentar pada berita."
      />
      <CommentTable rows={rows} />
    </>
  );
}
