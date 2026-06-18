import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getCurrentProfile } from "@/modules/auth";
import { DashboardPageHeader } from "@/modules/dashboard";
import { getAdminNewsList, NewsTable } from "@/modules/news";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;
  const isAdmin = profile.role === "super_admin" || profile.role === "admin";
  const items = await getAdminNewsList(isAdmin ? undefined : profile.id);

  return (
    <>
      <DashboardPageHeader
        title="Berita"
        description={isAdmin ? "Kelola seluruh berita organisasi." : "Kelola berita yang Anda tulis."}
        action={
          <Button asChild>
            <Link href="/dashboard/berita/baru">
              <Plus className="size-4" />
              Tulis Berita
            </Link>
          </Button>
        }
      />
      <NewsTable items={items} />
    </>
  );
}
