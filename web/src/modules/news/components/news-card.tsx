import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { formatDate, pickLocale } from "@/shared/lib/locale";
import type { News } from "@/shared/lib/types";
import { HoverLift } from "@/shared/ui/motion";
import { CalendarDays } from "lucide-react";
import Image from "next/image";

export function NewsCard({ news, locale }: { news: News; locale: string }) {
  const title = pickLocale(news.title, locale);
  return (
    <HoverLift className="h-full">
      <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-md">
        <Link href={`/berita/${news.slug}`} className="flex h-full flex-col">
          <div className="relative aspect-video w-full">
            <Image
              src={news.thumbnail_url ?? "/images/news-placeholder.svg"}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
            {news.category ? (
              <Badge className="absolute top-3 left-3">
                {pickLocale(news.category.name, locale)}
              </Badge>
            ) : null}
          </div>
          <CardContent className="flex flex-1 flex-col gap-2 p-5">
            <h3 className="line-clamp-2 font-semibold leading-snug">{title}</h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {pickLocale(news.excerpt, locale)}
            </p>
            <p className="text-muted-foreground mt-auto flex items-center gap-1.5 pt-2 text-xs">
              <CalendarDays className="size-3.5" />
              <time dateTime={news.published_at}>{formatDate(news.published_at, locale)}</time>
            </p>
          </CardContent>
        </Link>
      </Card>
    </HoverLift>
  );
}
