import { getCurrentProfile } from "@/modules/auth";
import { DashboardPageHeader } from "@/modules/dashboard";
import { getCategories, getNewsForEdit, NewsEditor } from "@/modules/news";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewsEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile) return null;
  const isAdmin = profile.role === "super_admin" || profile.role === "admin";
  const [categories, news] = await Promise.all([getCategories(), getNewsForEdit(id)]);
  if (!news) notFound();

  return (
    <>
      <DashboardPageHeader title="Edit Berita" description="Perbarui berita." />
      <NewsEditor categories={categories} initial={news} canPublish={isAdmin} />
    </>
  );
}
