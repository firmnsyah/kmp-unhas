import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/modules/dashboard";
import { FormBuilder, getFormForEdit } from "@/modules/forms";
import { Link } from "@/i18n/navigation";
import { BarChart2 } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FormEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const form = await getFormForEdit(id);
  if (!form) notFound();

  return (
    <>
      <DashboardPageHeader
        title={form.title.id}
        description="Kelola pertanyaan dan pengaturan form."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/form/${id}/respons`}>
              <BarChart2 className="size-4" />
              Lihat Respons
            </Link>
          </Button>
        }
      />
      <FormBuilder form={form} questions={form.questions} />
    </>
  );
}
