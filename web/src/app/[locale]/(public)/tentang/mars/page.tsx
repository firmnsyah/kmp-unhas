import { Card, CardContent } from "@/components/ui/card";
import { getMarsContent } from "@/modules/cms";
import { richTextToHtml } from "@/shared/lib/html";
import { pickLocale } from "@/shared/lib/locale";
import { toYouTubeEmbed } from "@/shared/lib/youtube";
import { Reveal } from "@/shared/ui/motion";
import { PageHeader, Section } from "@/shared/ui/section";
import { Music } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("marsTitle"), description: t("marsSubtitle") };
}

export default async function MarsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const mars = await getMarsContent();
  const embedUrl = toYouTubeEmbed(mars.video_url);

  return (
    <>
      <PageHeader title={t("marsTitle")} subtitle={t("marsSubtitle")} />
      <Section className="max-w-2xl">
        {embedUrl ? (
          <Reveal className="mb-8">
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <iframe
                src={embedUrl}
                title={t("marsTitle")}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="aspect-video w-full"
              />
            </div>
          </Reveal>
        ) : null}
        <Reveal>
          <Card>
            <CardContent className="space-y-5 py-8 text-center">
              <Music className="text-primary mx-auto size-8" aria-hidden />
              <div
                className="prose prose-sm prose-neutral dark:prose-invert mx-auto max-w-none text-pretty leading-relaxed"
                dangerouslySetInnerHTML={{ __html: richTextToHtml(pickLocale(mars.lyrics, locale)) }}
              />
            </CardContent>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
