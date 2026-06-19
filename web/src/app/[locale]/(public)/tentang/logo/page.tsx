import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAboutContent } from "@/modules/cms";
import { richTextToHtml } from "@/shared/lib/html";
import { pickLocale } from "@/shared/lib/locale";
import { Reveal } from "@/shared/ui/motion";
import { PageHeader, Section } from "@/shared/ui/section";
import { Download } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("logoTitle"), description: t("logoSubtitle") };
}

export default async function LogoPage({
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
      <PageHeader title={t("logoTitle")} subtitle={t("logoSubtitle")} />
      <Section className="space-y-8">
        {/* Pembuat logo */}
        <Reveal delay={0.08}>
          <Card>
            <CardContent className="flex flex-col items-center gap-6 sm:flex-row">
              <Image
                src={about.logo_creator.photo_url}
                alt={about.logo_creator.name}
                width={200}
                height={200}
                className="size-24 shrink-0 rounded-full object-cover"
              />
              <div className="space-y-1.5 text-center sm:text-left">
                <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                  {t("logoCreator")}
                </p>
                <h2 className="text-lg font-bold">{about.logo_creator.name}</h2>
                <div
                  className="prose prose-sm prose-neutral dark:prose-invert text-muted-foreground max-w-none text-pretty"
                  dangerouslySetInnerHTML={{ __html: richTextToHtml(pickLocale(about.logo_creator.description, locale)) }}
                />
              </div>
            </CardContent>
          </Card>
        </Reveal>
        
        {/* Logo + filosofi + tombol unduh */}
        <Reveal>
          <Card>
            <CardContent className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
              <Image
                src="/images/logo.png"
                alt="Logo KMP-UNHAS"
                width={300}
                height={300}
                className="size-40 shrink-0 object-contain md:size-56"
              />
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-xl font-bold md:text-2xl">{t("logoPhilosophy")}</h2>
                <div
                  className="prose prose-sm prose-neutral dark:prose-invert text-muted-foreground max-w-none text-pretty"
                  dangerouslySetInnerHTML={{ __html: richTextToHtml(pickLocale(about.logo_philosophy, locale)) }}
                />
                <Button asChild>
                  <a href={about.logo_download_url} download>
                    <Download className="size-4" />
                    {t("downloadLogo")}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
