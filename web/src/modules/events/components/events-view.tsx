"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrgEvent } from "@/shared/lib/types";
import { Reveal } from "@/shared/ui/motion";
import { EmptyState } from "@/shared/ui/section";
import { AnimatePresence, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { EventCard } from "./event-card";

type TypeFilter = "all" | "proker" | "non_proker";

export function EventsView({
  upcoming,
  done,
}: {
  upcoming: OrgEvent[];
  done: OrgEvent[];
}) {
  const t = useTranslations("events");
  const locale = useLocale();
  const [status, setStatus] = useState<"upcoming" | "done">("upcoming");
  const [type, setType] = useState<TypeFilter>("all");

  const labels = useMemo(
    () => ({
      proker: t("proker"),
      nonProker: t("nonProker"),
      organizer: (name: string) => t("organizer", { name }),
    }),
    [t],
  );

  const source = status === "upcoming" ? upcoming : done;
  const events = type === "all" ? source : source.filter((e) => e.type === type);

  const statusFilters: { key: "upcoming" | "done"; label: string }[] = [
    { key: "upcoming", label: t("upcoming") },
    { key: "done", label: t("done") },
  ];

  const typeFilters: { key: TypeFilter; label: string }[] = [
    { key: "all", label: t("all") },
    { key: "proker", label: t("proker") },
    { key: "non_proker", label: t("nonProker") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter status: pill terpisah, merah saat terpilih */}
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("title")}>
          {statusFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setStatus(filter.key)}
              aria-pressed={status === filter.key}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
                status === filter.key
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label={t("title")}>
          {typeFilters.map((filter) => (
            <button key={filter.key} type="button" onClick={() => setType(filter.key)}>
              <Badge
                variant={type === filter.key ? "default" : "outline"}
                className={cn("cursor-pointer")}
              >
                {filter.label}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={`${status}-${type}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {events.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((event, i) => (
                <Reveal key={event.id} delay={(i % 2) * 0.05} className="h-full">
                  <EventCard event={event} locale={locale} labels={labels} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState message={t("noEvents")} />
          )}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
