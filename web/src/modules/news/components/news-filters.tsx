"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { pickLocale } from "@/shared/lib/locale";
import type { NewsCategory } from "@/shared/lib/types";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function NewsFilters({
  categories,
  activeCategory,
  initialQuery,
}: {
  categories: NewsCategory[];
  activeCategory?: string;
  initialQuery?: string;
}) {
  const t = useTranslations("news");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery ?? "");

  // Debounce pencarian → update query param (reset halaman)
  useEffect(() => {
    const handle = setTimeout(() => {
      if ((initialQuery ?? "") === query) return;
      const params = new URLSearchParams();
      if (activeCategory) params.set("kategori", activeCategory);
      if (query) params.set("q", query);
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
    }, 400);
    return () => clearTimeout(handle);
  }, [query, activeCategory, initialQuery, pathname, router]);

  const categoryHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("kategori", slug);
    if (query) params.set("q", query);
    return `${pathname}${params.size ? `?${params}` : ""}`;
  };

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <nav className="flex flex-wrap gap-2" aria-label={t("title")}>
        <Link href={categoryHref()} scroll={false}>
          <Badge variant={!activeCategory ? "default" : "outline"} className="cursor-pointer">
            {t("allCategories")}
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={categoryHref(cat.slug)} scroll={false}>
            <Badge
              variant={activeCategory === cat.slug ? "default" : "outline"}
              className="cursor-pointer"
            >
              {pickLocale(cat.name, locale)}
            </Badge>
          </Link>
        ))}
      </nav>

      <div className="relative w-full sm:w-64">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className={cn("pl-9")}
        />
      </div>
    </div>
  );
}
