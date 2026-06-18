"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * shadcn-style Calendar untuk react-day-picker v10.
 * RDP v10 me-render <table>/<thead>/<tbody>/<tr>/<th>/<td>, jadi grid TIDAK
 * boleh pakai flex pada baris — gunakan layout tabel + sel berukuran tetap.
 * Modifier (selected/today/...) menempel di <td>, tombol dirender di dalamnya
 * sehingga di-target lewat [&>button].
 */
export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const navBtn =
    "border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-7 items-center justify-center rounded-md border transition-colors disabled:pointer-events-none disabled:opacity-50";
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-4",
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "text-sm font-medium",
        nav: "absolute inset-x-0 top-0 z-10 flex h-8 items-center justify-between px-1",
        button_previous: navBtn,
        button_next: navBtn,
        month_grid: "w-full border-collapse",
        weekdays: "",
        weekday: "text-muted-foreground size-8 text-[0.8rem] font-normal",
        weeks: "",
        week: "",
        day: "size-8 p-0 text-center align-middle",
        day_button:
          "hover:bg-accent hover:text-accent-foreground inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-sm font-normal transition-colors aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary",
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary",
        today: "[&>button]:ring-primary [&>button]:ring-1 [&>button]:ring-inset",
        outside: "[&>button]:text-muted-foreground/40",
        disabled: "[&>button]:pointer-events-none [&>button]:opacity-40",
        range_start: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:rounded-l-md",
        range_end: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:rounded-r-md",
        range_middle: "[&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}
