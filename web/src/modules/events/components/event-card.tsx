import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, pickLocale } from "@/shared/lib/locale";
import type { OrgEvent } from "@/shared/lib/types";
import { CalendarDays, MapPin } from "lucide-react";

export function EventCard({
  event,
  locale,
  labels,
}: {
  event: OrgEvent;
  locale: string;
  labels: { proker: string; nonProker: string; organizer: (name: string) => string };
}) {
  const start = new Date(event.start_at);
  const monthLabel = formatDate(start, locale, { month: "short" });

  return (
    <Card className="h-full p-0">
      <CardContent className="flex h-full gap-4 p-5">
        {/* Badge tanggal */}
        <div
          className="brand-gradient flex size-16 shrink-0 flex-col items-center justify-center rounded-lg text-white"
          aria-hidden
        >
          <span className="text-xl font-bold leading-none">{start.getDate()}</span>
          <span className="text-[11px] font-medium uppercase">{monthLabel}</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={event.type === "proker" ? "default" : "secondary"}>
              {event.type === "proker" ? labels.proker : labels.nonProker}
            </Badge>
            {event.department_name ? (
              <span className="text-muted-foreground text-xs">
                {labels.organizer(pickLocale(event.department_name, locale))}
              </span>
            ) : null}
          </div>
          <h3 className="font-semibold leading-snug">{pickLocale(event.title, locale)}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {pickLocale(event.description, locale)}
          </p>
          {/* Tanggal & lokasi menempel di bawah kartu */}
          <div className="text-muted-foreground mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              <time dateTime={event.start_at}>
                {formatDate(event.start_at, locale)}
                {event.end_at ? ` – ${formatDate(event.end_at, locale)}` : ""}
              </time>
            </span>
            {event.location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {event.location}
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
