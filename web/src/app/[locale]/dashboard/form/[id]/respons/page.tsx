import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/modules/dashboard";
import { getFormResponses, ResponsesTable } from "@/modules/forms";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FormResponsesPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const { form, responses } = await getFormResponses(id);
  if (!form) notFound();

  return (
    <>
      <DashboardPageHeader
        title={`Respons: ${form.title.id}`}
        description={`${responses.length} respons masuk`}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/form/${id}`}>
              <ArrowLeft className="size-4" />
              Kembali ke Builder
            </Link>
          </Button>
        }
      />
      <ResponsesTable questions={form.questions} responses={responses} />
    </>
  );
}
