import {
  getCategories,
  getNewsList,
  NewsCard,
  NewsFilters,
  NewsPagination,
} from "@/modules/news";
import { Reveal } from "@/shared/ui/motion";
import { EmptyState, PageHeader, Section } from "@/shared/ui/section";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kategori?: string; q?: string; page?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { kategori, q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const t = await getTranslations("news");
  const [categories, { items, totalPages }] = await Promise.all([
    getCategories(),
    getNewsList({ locale, category: kategori, q, page }),
  ]);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Section>
        <NewsFilters categories={categories} activeCategory={kategori} initialQuery={q} />
        {items.length ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((news, i) => (
                <Reveal key={news.id} delay={(i % 3) * 0.05}>
                  <NewsCard news={news} locale={locale} />
                </Reveal>
              ))}
            </div>
            <NewsPagination page={page} totalPages={totalPages} />
          </>
        ) : (
          <EmptyState message={t("notFound")} />
        )}
      </Section>
    </>
  );
}
