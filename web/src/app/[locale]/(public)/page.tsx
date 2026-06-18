import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import {
  getChairmanContent,
  getHeroContent,
  getStatsContent,
} from "@/modules/cms";
import { getUpcomingEvents, EventCard } from "@/modules/events";
import { getActiveHomeForms } from "@/modules/forms";
import { getRecentPhotos } from "@/modules/gallery";
import { getLatestNews, NewsCard } from "@/modules/news";
import { formatDate, pickLocale } from "@/shared/lib/locale";
import { CountUp, HoverLift, Reveal } from "@/shared/ui/motion";
import { EmptyState, Section, SectionHeading } from "@/shared/ui/section";
import { ArrowRight, ClipboardList, Quote } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Hero } from "./_sections/hero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tEvents = await getTranslations("events");

  const [hero, stats, chairman, latestNews, upcomingEvents, recentPhotos, activeForms] = await Promise.all([
    getHeroContent(),
    getStatsContent(),
    getChairmanContent(),
    getLatestNews(3),
    getUpcomingEvents(3),
    getRecentPhotos(8),
    getActiveHomeForms(),
  ]);

  const statItems = [
    { label: t("stats.founded"), value: stats.founded, plain: true },
    { label: t("stats.members"), value: stats.members, suffix: "+" },
    { label: t("stats.departments"), value: stats.departments },
    { label: t("stats.programs"), value: stats.programs },
  ];

  return (
    <>
      <Hero
        title={pickLocale(hero.title, locale)}
        subtitle={pickLocale(hero.subtitle, locale)}
        description={pickLocale(hero.description, locale)}
        ctaPrimary={t("heroCtaPrimary")}
        ctaSecondary={t("heroCtaSecondary")}
        images={hero.images}
      />

      {/* Statistik */}
      <Section className="py-10 md:py-14">
        <h2 className="sr-only">{t("stats.title")}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statItems.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.05}>
              <Card className="text-center">
                <CardContent className="py-2">
                  <p className="text-primary text-3xl font-extrabold md:text-4xl">
                    {stat.plain ? stat.value : <CountUp value={stat.value} />}
                    {stat.suffix}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Sambutan ketua */}
      <Section className="py-10 md:py-14">
        <Reveal>
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:flex-row md:text-left">
              <Avatar className="size-24 shrink-0 md:size-28">
                <AvatarImage src={chairman.photo_url} alt={chairman.name} />
                <AvatarFallback>{chairman.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-3">
                <Quote className="text-primary mx-auto size-6 md:mx-0" aria-hidden />
                <blockquote className="text-pretty italic">
                  &ldquo;{pickLocale(chairman.quote, locale)}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold">{chairman.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {t("chairman.title")} · {t("chairman.period", { period: chairman.period })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </Section>

      {/* Berita terbaru */}
      <Section>
        <SectionHeading
          title={t("latestNews.title")}
          subtitle={t("latestNews.subtitle")}
          action={
            <Button asChild variant="ghost" className="text-primary">
              <Link href="/berita">
                {tCommon("actions.viewAll")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        {latestNews.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((news, i) => (
              <Reveal key={news.id} delay={i * 0.05}>
                <NewsCard news={news} locale={locale} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState message={tCommon("emptyState")} />
        )}
      </Section>

      {/* Agenda mendatang */}
      <Section>
        <SectionHeading
          title={t("upcomingEvents.title")}
          subtitle={t("upcomingEvents.subtitle")}
          action={
            <Button asChild variant="ghost" className="text-primary">
              <Link href="/agenda">
                {tCommon("actions.viewAll")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        {upcomingEvents.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {upcomingEvents.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.05} className="h-full">
                <EventCard
                  event={event}
                  locale={locale}
                  labels={{
                    proker: tEvents("proker"),
                    nonProker: tEvents("nonProker"),
                    organizer: (name) => tEvents("organizer", { name }),
                  }}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState message={tCommon("emptyState")} />
        )}
      </Section>

      {/* Form aktif (deadline masih berlaku) */}
      {activeForms.length ? (
        <Section>
          <SectionHeading title="Form Terbuka" subtitle="Isi form yang masih dibuka sebelum tenggat" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeForms.map((form, i) => (
              <Reveal key={form.id} delay={(i % 3) * 0.05}>
                <HoverLift className="h-full">
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col gap-2">
                      <span className="text-primary flex size-10 items-center justify-center">
                        <ClipboardList className="size-5" />
                      </span>
                      <h3 className="font-semibold leading-snug">{pickLocale(form.title, locale)}</h3>
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {pickLocale(form.description, locale)}
                      </p>
                      <p className="text-muted-foreground mt-auto text-xs">
                        Ditutup: {formatDate(form.deadline_at, locale, { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <Button asChild size="sm" className="mt-2 w-fit">
                        <Link href={`/form/${form.slug}`}>Isi Form</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </HoverLift>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Preview galeri */}
      <Section>
        <SectionHeading
          title={t("galleryPreview.title")}
          subtitle={t("galleryPreview.subtitle")}
          action={
            <Button asChild variant="ghost" className="text-primary">
              <Link href="/galeri">
                {tCommon("actions.viewAll")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        {recentPhotos.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recentPhotos.map((photo, i) => (
              <Reveal key={photo.id} delay={i * 0.03}>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={photo.image_url}
                    alt={pickLocale(photo.caption, locale) || t("galleryPreview.title")}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState message={tCommon("emptyState")} />
        )}
      </Section>

      {/* CTA pendaftaran */}
      <Section>
        <Reveal>
          <div className="brand-gradient relative overflow-hidden rounded-2xl px-6 py-12 text-center text-white md:px-12 md:py-16">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_55%)]"
            />
            <div className="relative space-y-4">
              <h2 className="text-2xl font-bold text-balance md:text-3xl">
                {t("registerCta.title")}
              </h2>
              <p className="mx-auto max-w-xl text-balance text-white/85">
                {t("registerCta.description")}
              </p>
              <Button asChild size="lg" variant="secondary" className="bg-white text-neutral-900 hover:bg-white/90">
                <Link href="/pendaftaran">
                  {t("registerCta.button")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
