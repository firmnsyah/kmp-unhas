import type { Localized } from "./types";

/** Ambil teks sesuai locale dengan fallback ke ID (PRD §4.10). */
export function pickLocale(
  value: Localized | null | undefined,
  locale: string,
): string {
  if (!value) return "";
  if (locale === "en" && value.en) return value.en;
  return value.id;
}

/** Versi array (mis. daftar misi). */
export function pickLocaleList(
  value: { id: string[]; en?: string[] } | null | undefined,
  locale: string,
): string[] {
  if (!value) return [];
  if (locale === "en" && value.en?.length) return value.en;
  return value.id;
}

export function formatDate(
  date: string | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", options).format(
    new Date(date),
  );
}
