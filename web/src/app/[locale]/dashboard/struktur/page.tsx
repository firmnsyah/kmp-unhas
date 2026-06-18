import { getCurrentProfile } from "@/modules/auth";
import { DashboardPageHeader } from "@/modules/dashboard";
import {
  DepartmentManager,
  getAllOrgMembers,
  getDepartments,
  MemberManager,
} from "@/modules/organization";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StrukturDashboardPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "super_admin") redirect("/dashboard");

  const [members, departments] = await Promise.all([getAllOrgMembers(), getDepartments()]);
  const pengurusInti = members.filter((m) => m.category === "pengurus_inti");
  const pimpinan = members.filter((m) => m.category === "pimpinan");
  const dewan = members.filter(
    (m) => m.category === "dewan_pembina" || m.category === "dewan_pertimbangan",
  );

  return (
    <>
      <DashboardPageHeader
        title="Struktur Organisasi"
        description="Kelola pengurus inti, dewan, departemen, dan pimpinan terdahulu."
      />
      <div className="space-y-10">
        <section>
          <MemberManager
            members={pengurusInti}
            heading="Pengurus Inti (Periode Saat Ini)"
            description="Ketua Umum, Wakil, Sekretaris, Bendahara — tampil di bagan Struktur Kepengurusan."
            categories={["pengurus_inti"]}
            emptyMessage="Belum ada pengurus inti."
          />
        </section>
        <section>
          <MemberManager
            members={dewan}
            heading="Dewan Pembina & Pertimbangan"
            description="Dewan pembina dan dewan pertimbangan organisasi."
            categories={["dewan_pembina", "dewan_pertimbangan"]}
            emptyMessage="Belum ada data dewan."
          />
        </section>
        <section>
          <DepartmentManager departments={departments} />
        </section>
        <section>
          <MemberManager
            members={pimpinan}
            heading="Pimpinan Terdahulu"
            description="Arsip Ketua/Pimpinan organisasi tiap periode."
            categories={["pimpinan"]}
            groupByPeriod
            emptyMessage="Belum ada data pimpinan."
          />
        </section>
      </div>
    </>
  );
}
