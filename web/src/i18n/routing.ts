import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Hanya Bahasa Indonesia (dukungan multibahasa dihapus).
  locales: ["id"],
  defaultLocale: "id",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
