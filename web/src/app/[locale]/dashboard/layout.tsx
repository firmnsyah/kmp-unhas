import { Link } from "@/i18n/navigation";
import { getCurrentProfile, isInternalRole } from "@/modules/auth";
import { DashboardHeader, SidebarNav } from "@/modules/dashboard";
import { Logo } from "@/shared/ui/logo";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();

  // Middleware sudah memastikan login; di sini tegakkan role internal & status aktif.
  if (!profile || !isInternalRole(profile.role) || !profile.is_active) {
    redirect("/login");
  }

  return (
    // Tinggi layar penuh + overflow-hidden: sidebar & header diam, hanya <main> yang scroll.
    <div className="flex h-svh overflow-hidden">
      <aside className="hidden w-64 shrink-0 flex-col border-r lg:flex">
        <div className="flex h-16 shrink-0 items-center border-b px-5">
          <Link href="/dashboard" aria-label="Dashboard">
            <Logo />
          </Link>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">
          <SidebarNav role={profile.role} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader profile={profile} />
        <main className="no-scrollbar bg-muted/30 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
