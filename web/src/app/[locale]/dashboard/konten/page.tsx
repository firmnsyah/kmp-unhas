import { getCurrentProfile } from "@/modules/auth";
import {
  CmsEditor,
  getAboutContent,
  getChairmanContent,
  getContactContent,
  getHeroContent,
  getMarsContent,
  getPrivacyContent,
  getSettingsContent,
  getStatsContent,
} from "@/modules/cms";
import { DashboardPageHeader } from "@/modules/dashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function KontenPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "super_admin") redirect("/dashboard");

  const [settings, hero, stats, chairman, about, contact, mars, privacy] = await Promise.all([
    getSettingsContent(),
    getHeroContent(),
    getStatsContent(),
    getChairmanContent(),
    getAboutContent(),
    getContactContent(),
    getMarsContent(),
    getPrivacyContent(),
  ]);

  return (
    <>
      <DashboardPageHeader
        title="Konten Website"
        description="Ubah teks dan gambar halaman publik tanpa menyentuh kode."
      />
      <CmsEditor content={{ settings, hero, stats, chairman, about, contact, mars, privacy }} />
    </>
  );
}
