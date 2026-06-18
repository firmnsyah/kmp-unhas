import { getAboutContent } from "@/modules/cms";
import { pickLocale } from "@/shared/lib/locale";
import { Reveal } from "@/shared/ui/motion";
import { PageHeader, Section } from "@/shared/ui/section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("historyTitle"), description: t("historySubtitle") };
}

export default async function SejarahPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const about = await getAboutContent();

  return (
    <>
      <PageHeader title={t("historyTitle")} subtitle={t("historySubtitle")} />
      <Section className="max-w-3xl">
        <Reveal>
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: pickLocale(about.history, locale) }}
          />
        </Reveal>
      </Section>
    </>
  );
}
