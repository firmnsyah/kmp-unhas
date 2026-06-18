"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");
const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const MINUTES = Array.from({ length: 12 }, (_, i) => pad(i * 5)); // kelipatan 5

/** Kolom waktu (jam / menit) bergaya shadcn — daftar tombol yang bisa di-scroll. */
function TimeColumn({
  label,
  values,
  value,
  onSelect,
}: {
  label: string;
  values: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex w-16 flex-col">
      <span className="text-muted-foreground border-b px-2 py-1.5 text-center text-xs font-medium">
        {label}
      </span>
      <div className="max-h-56 overflow-y-auto p-1">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onSelect(v)}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground mb-0.5 w-full rounded-md px-2 py-1.5 text-center text-sm transition-colors",
              v === value && "bg-primary text-primary-foreground hover:bg-primary",
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Datepicker (tanggal saja) — output hidden input YYYY-MM-DD &/atau callback onChange. */
export function DatePicker({
  name,
  defaultValue,
  placeholder = "Pilih tanggal",
  className,
  onChange,
}: {
  name?: string;
  defaultValue?: string | null;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
}) {
  const init = defaultValue ? new Date(defaultValue) : undefined;
  const [selected, setSelected] = useState<Date | undefined>(
    init && !isNaN(init.getTime()) ? init : undefined,
  );
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {name ? <input type="hidden" name={name} value={selected ? format(selected, "yyyy-MM-dd") : ""} /> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0" />
            {selected ? format(selected, "dd MMMM yyyy", { locale: idLocale }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => {
              setSelected(d);
              onChange?.(d ? format(d, "yyyy-MM-dd") : "");
              setOpen(false);
            }}
            locale={idLocale}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Datepicker + waktu — satu tombol; kalender & pemilih jam/menit (grid, tanpa scroll). */
export function DateTimePicker({
  name,
  defaultValue,
  placeholder = "Pilih tanggal & waktu",
  className,
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  className?: string;
}) {
  function parse(v?: string | null) {
    if (!v) return { date: undefined, h: "00", m: "00" };
    const d = new Date(v);
    if (isNaN(d.getTime())) return { date: undefined, h: "00", m: "00" };
    return { date: d, h: pad(d.getHours()), m: pad(d.getMinutes()) };
  }
  const init = parse(defaultValue);
  const [selected, setSelected] = useState<Date | undefined>(init.date);
  const [hour, setHour] = useState(init.h);
  const [minute, setMinute] = useState(init.m);
  const [open, setOpen] = useState(false);

  const minuteOptions = MINUTES.includes(minute) ? MINUTES : [...MINUTES, minute].sort();

  function buildIso(): string {
    if (!selected) return "";
    const d = new Date(selected);
    d.setHours(Number(hour), Number(minute), 0, 0);
    return d.toISOString();
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <input type="hidden" name={name} value={buildIso()} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0" />
            <span className="truncate">
              {selected
                ? `${format(selected, "dd MMM yyyy", { locale: idLocale })}, ${hour}:${minute}`
                : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" portal={false}>
          <div className="flex flex-col sm:flex-row sm:items-stretch">
            <Calendar mode="single" selected={selected} onSelect={setSelected} locale={idLocale} />
            <div className="flex border-t sm:border-t-0 sm:border-l">
              <TimeColumn label="Jam" values={HOURS} value={hour} onSelect={setHour} />
              <TimeColumn label="Menit" values={minuteOptions} value={minute} onSelect={setMinute} />
            </div>
          </div>
          <div className="flex justify-end border-t p-2">
            <Button type="button" size="sm" onClick={() => setOpen(false)}>
              Selesai
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
