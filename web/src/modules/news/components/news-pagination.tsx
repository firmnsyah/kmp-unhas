"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export function NewsPagination({ page, totalPages }: { page: number; totalPages: number }) {
  const t = useTranslations("news");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const pageHref = (target: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (target > 1) params.set("page", String(target));
    else params.delete("page");
    return `${pathname}${params.size ? `?${params}` : ""}`;
  };

  return (
    <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
      <Button asChild={page > 1} variant="outline" size="sm" disabled={page <= 1}>
        {page > 1 ? (
          <Link href={pageHref(page - 1)} scroll={false}>
            <ChevronLeft className="size-4" />
            {t("prevPage")}
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" />
            {t("prevPage")}
          </span>
        )}
      </Button>
      <span className="text-muted-foreground text-sm">
        {t("pageOf", { page, total: totalPages })}
      </span>
      <Button asChild={page < totalPages} variant="outline" size="sm" disabled={page >= totalPages}>
        {page < totalPages ? (
          <Link href={pageHref(page + 1)} scroll={false}>
            {t("nextPage")}
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span>
            {t("nextPage")}
            <ChevronRight className="size-4" />
          </span>
        )}
      </Button>
    </nav>
  );
}
