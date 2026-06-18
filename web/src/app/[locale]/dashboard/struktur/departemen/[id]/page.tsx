import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { DashboardPageHeader } from "@/modules/dashboard";
import { DeptMemberManager, DeptProgramManager, getDepartmentById } from "@/modules/organization";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DeptDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const dept = await getDepartmentById(id);
  if (!dept) notFound();

  return (
    <>
      <DashboardPageHeader
        title={dept.name.id}
        description="Kelola pengurus dan program kerja departemen."
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/struktur">
              <ArrowLeft className="size-4" />
              Kembali
            </Link>
          </Button>
        }
      />
      <div className="space-y-10">
        <section>
          <DeptMemberManager departmentId={dept.id} members={dept.members} />
        </section>
        <section>
          <DeptProgramManager departmentId={dept.id} programs={dept.programs} />
        </section>
      </div>
    </>
  );
}
