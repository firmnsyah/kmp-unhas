import { listAccounts, AccountManager } from "@/modules/accounts";
import { getCurrentProfile, type UserRole } from "@/modules/auth";

export const dynamic = "force-dynamic";

export default async function AkunPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const accounts = await listAccounts(profile.role);
  const roleOptions: UserRole[] =
    profile.role === "super_admin" ? ["admin", "panitia"] : ["panitia"];

  return (
    <AccountManager
      accounts={accounts}
      roleOptions={roleOptions}
      canManageRoles={profile.role === "super_admin"}
      title="Manajemen Akun"
      description={
        profile.role === "super_admin"
          ? "Kelola seluruh akun pengurus."
          : "Kelola akun panitia."
      }
    />
  );
}
