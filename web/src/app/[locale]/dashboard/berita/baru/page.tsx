import { getCurrentProfile } from "@/modules/auth";
import { DashboardPageHeader } from "@/modules/dashboard";
import { getCategories, NewsEditor } from "@/modules/news";

export const dynamic = "force-dynamic";

export default async function NewsCreatePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;
  const isAdmin = profile.role === "super_admin" || profile.role === "admin";
  const categories = await getCategories();

  return (
    <>
      <DashboardPageHeader title="Tulis Berita" description="Buat berita baru." />
      <NewsEditor categories={categories} canPublish={isAdmin} />
    </>
  );
}
