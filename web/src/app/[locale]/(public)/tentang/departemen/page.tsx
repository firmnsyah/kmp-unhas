import { DepartmentCard, getDepartments } from "@/modules/organization";
import { Reveal } from "@/shared/ui/motion";
import { EmptyState, PageHeader, Section } from "@/shared/ui/section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "structure" });
  return { title: t("departmentsTitle"), description: t("departmentsSubtitle") };
}

export default async function DepartemenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("structure");
  const tCommon = await getTranslations("common");
  const departments = await getDepartments();

  return (
    <>
      <PageHeader title={t("departmentsTitle")} subtitle={t("departmentsSubtitle")} />
      <Section>
        {departments.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, i) => (
              <Reveal key={dept.id} delay={(i % 3) * 0.05}>
                <DepartmentCard
                  department={dept}
                  locale={locale}
                  detailLabel={t("viewDetail")}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState message={tCommon("emptyState")} />
        )}
      </Section>
    </>
  );
}
