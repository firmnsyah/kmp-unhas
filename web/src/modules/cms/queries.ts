import {
  FALLBACK_ABOUT,
  FALLBACK_CHAIRMAN,
  FALLBACK_CONTACT,
  FALLBACK_HERO,
  FALLBACK_MARS,
  FALLBACK_PRIVACY,
  FALLBACK_SETTINGS,
  FALLBACK_STATS,
} from "@/shared/config/fallback-content";
import { queryOrFallback } from "@/shared/lib/supabase";
import type {
  AboutContent,
  ChairmanContent,
  ContactContent,
  HeroContent,
  MarsContent,
  PrivacyContent,
  SettingsContent,
  StatsContent,
} from "@/shared/lib/types";

async function getContent<T>(key: string, fallback: T): Promise<T> {
  return queryOrFallback(
    fallback,
    (db) => db.from("site_content").select("value").eq("key", key).maybeSingle(),
    (row: { value: T } | null) => row?.value ?? fallback,
  );
}

export const getHeroContent = () => getContent<HeroContent>("home_hero", FALLBACK_HERO);
export const getStatsContent = () => getContent<StatsContent>("home_stats", FALLBACK_STATS);
export const getChairmanContent = () => getContent<ChairmanContent>("chairman", FALLBACK_CHAIRMAN);
export const getAboutContent = () => getContent<AboutContent>("about", FALLBACK_ABOUT);
export const getContactContent = () => getContent<ContactContent>("contact", FALLBACK_CONTACT);
export const getSettingsContent = () => getContent<SettingsContent>("settings", FALLBACK_SETTINGS);
export const getPrivacyContent = () => getContent<PrivacyContent>("privacy", FALLBACK_PRIVACY);
export const getMarsContent = () => getContent<MarsContent>("mars", FALLBACK_MARS);
