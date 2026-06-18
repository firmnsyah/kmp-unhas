import { getPrivacyContent } from "@/modules/cms";
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
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");
  const privacy = await getPrivacyContent();

  return (
    <>
      <PageHeader title={t("title")} />
      <Section className="max-w-3xl">
        <Reveal>
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: pickLocale(privacy.content, locale) }}
          />
        </Reveal>
      </Section>
    </>
  );
}
