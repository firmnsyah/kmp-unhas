import { getDepartmentsWithMembers, getOrgMembers, OrgChart } from "@/modules/organization";
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
  return { title: t("structureTitle") };
}

export default async function StrukturKepengurusanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("structure");
  const tCommon = await getTranslations("common");
  const [core, departments, advisory] = await Promise.all([
    getOrgMembers("pengurus_inti"),
    getDepartmentsWithMembers(),
    getOrgMembers("dewan_pertimbangan"),
  ]);
  const period = core[0]?.period ?? "—";
  const hasContent = core.length > 0 || departments.length > 0;

  return (
    <>
      <PageHeader
        title={t("structureTitle")}
        subtitle={t("structureSubtitle", { period })}
      />
      <Section>
        {hasContent ? (
          <Reveal>
            <OrgChart
              core={core}
              departments={departments}
              advisory={advisory}
              locale={locale}
              departmentsLabel={t("departments")}
              advisoryLabel="Dewan Pertimbangan"
            />
          </Reveal>
        ) : (
          <EmptyState message={tCommon("emptyState")} />
        )}
      </Section>
    </>
  );
}
