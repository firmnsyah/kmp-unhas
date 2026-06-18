import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/modules/comments";
import {
  getLatestNews,
  getNewsBySlug,
  getRelatedNews,
  NewsCard,
  ShareButtons,
} from "@/modules/news";
import { siteConfig } from "@/shared/config/site";
import { formatDate, pickLocale } from "@/shared/lib/locale";
import { Reveal } from "@/shared/ui/motion";
import { Section } from "@/shared/ui/section";
import { CalendarDays, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const news = await getLatestNews(20);
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) return {};

  const title = pickLocale(news.title, locale);
  const description = pickLocale(news.excerpt, locale);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: news.published_at,
      ...(news.thumbnail_url && !news.thumbnail_url.endsWith(".svg")
        ? { images: [{ url: news.thumbnail_url }] }
        : {}),
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const news = await getNewsBySlug(slug);
  if (!news) notFound();

  const t = await getTranslations("news");
  const tCommon = await getTranslations("common");
  const related = await getRelatedNews(news, 3);

  const title = pickLocale(news.title, locale);
  const url = `${siteConfig.url}${locale === "en" ? "/en" : ""}/berita/${news.slug}`;

  return (
    <>
      <Section className="max-w-3xl">
        <Reveal>
          <article>
            <header className="space-y-4">
              {news.category ? (
                <Badge>{pickLocale(news.category.name, locale)}</Badge>
              ) : null}
              <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
                {title}
              </h1>
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="flex items-center gap-1.5">
                  <UserRound className="size-4" />
                  {news.author_name ?? tCommon("defaultAuthor")}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  <time dateTime={news.published_at}>
                    {formatDate(news.published_at, locale)}
                  </time>
                </span>
              </div>
            </header>

            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={news.thumbnail_url ?? "/images/news-placeholder.svg"}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>

            <div
              className="prose prose-neutral dark:prose-invert mt-8 max-w-none [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: pickLocale(news.content, locale) }}
            />

            <Separator className="my-8" />
            <ShareButtons url={url} title={title} />
          </article>
        </Reveal>

        <Separator className="my-10" />
        <Reveal>
          <CommentSection newsId={news.id} />
        </Reveal>
      </Section>

      {related.length ? (
        <Section className="pt-0">
          <Reveal>
            <h2 className="mb-6 text-xl font-bold md:text-2xl">{t("relatedNews")}</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 0.05}>
                <NewsCard news={item} locale={locale} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
