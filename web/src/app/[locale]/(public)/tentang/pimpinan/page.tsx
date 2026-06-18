import { getOrgMembers, MemberGrid } from "@/modules/organization";
import { PageHeader, Section } from "@/shared/ui/section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "structure" });
  return { title: t("leadershipTitle") };
}

export default async function PimpinanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("structure");
  const tCommon = await getTranslations("common");
  const members = await getOrgMembers("pimpinan");
  const period = members[0]?.period ?? "—";

  return (
    <>
      <PageHeader
        title={t("leadershipTitle")}
        subtitle={t("leadershipSubtitle", { period })}
      />
      <Section>
        <MemberGrid
          members={members}
          locale={locale}
          batchLabel={(batch) => t("batch", { batch })}
          emptyMessage={tCommon("emptyState")}
        />
      </Section>
    </>
  );
}
