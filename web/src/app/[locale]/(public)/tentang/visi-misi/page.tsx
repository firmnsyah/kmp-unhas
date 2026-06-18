import { Card, CardContent } from "@/components/ui/card";
import { getAboutContent } from "@/modules/cms";
import { pickLocale, pickLocaleList } from "@/shared/lib/locale";
import { Reveal } from "@/shared/ui/motion";
import { PageHeader, Section } from "@/shared/ui/section";
import { CheckCircle2, Eye, Flag, Sparkles, Target } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("visionMissionTitle"), description: t("visionMissionSubtitle") };
}

function ListCard({
  icon,
  title,
  items,
  accent = "primary",
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  accent?: "primary" | "secondary";
}) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-3">
        <span
          className={accent === "secondary" ? "text-secondary flex" : "text-primary flex"}
        >
          {icon}
        </span>
        <h3 className="text-lg font-bold">{title}</h3>
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm">
              <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default async function VisiMisiPage({
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
      <PageHeader title={t("visionMissionTitle")} subtitle={t("visionMissionSubtitle")} />

      {/* Section 1: Tujuan & Usaha */}
      <Section className="pb-6">
        <Reveal className="mb-6">
          <h2 className="text-xl font-bold md:text-2xl">{t("goalsTitle")}</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <ListCard
              icon={<Flag className="size-6" />}
              title={t("purpose")}
              items={pickLocaleList(about.purpose, locale)}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <ListCard
              icon={<Sparkles className="size-6" />}
              title={t("efforts")}
              items={pickLocaleList(about.efforts, locale)}
              accent="secondary"
            />
          </Reveal>
        </div>
      </Section>

      {/* Section 2: Visi & Misi */}
      <Section className="pt-6">
        <Reveal className="mb-6">
          <h2 className="text-xl font-bold md:text-2xl">{t("visionMissionTitle")}</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <CardContent className="space-y-3">
                <span className="text-primary flex">
                  <Eye className="size-6" />
                </span>
                <h3 className="text-lg font-bold">{t("vision")}</h3>
                <p className="text-muted-foreground text-pretty">
                  {pickLocale(about.vision, locale)}
                </p>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <ListCard
              icon={<Target className="size-6" />}
              title={t("mission")}
              items={pickLocaleList(about.missions, locale)}
              accent="secondary"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
