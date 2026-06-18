import { getCurrentProfile, ProfileForm } from "@/modules/auth";
import { DashboardPageHeader } from "@/modules/dashboard";
import { getServerSupabase } from "@/shared/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const profile = await getCurrentProfile();
  const supabase = await getServerSupabase();
  if (!profile || !supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <DashboardPageHeader title="Pengaturan Profil" description="Kelola informasi akun dan kata sandi Anda." />
      <ProfileForm fullName={profile.full_name} email={user?.email ?? ""} />
    </>
  );
}
