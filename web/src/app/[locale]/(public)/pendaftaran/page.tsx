import { getSettingsContent } from "@/modules/cms";
import { RegistrationForm } from "@/modules/registration";
import { Reveal } from "@/shared/ui/motion";
import { PageHeader, Section } from "@/shared/ui/section";
import { Info } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "registration" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("registration");
  const settings = await getSettingsContent();

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Section>
        {settings.registration_open ? (
          <Reveal>
            <RegistrationForm />
          </Reveal>
        ) : (
          <Reveal className="mx-auto max-w-lg">
            <div className="bg-accent text-accent-foreground flex items-start gap-3 rounded-lg border px-5 py-4">
              <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="text-sm">{t("closed")}</p>
            </div>
          </Reveal>
        )}
      </Section>
    </>
  );
}
