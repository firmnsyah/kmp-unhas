// Tipe domain bersama (cermin skema database — PRD §9.1)

/** Konten dwibahasa: {"id": "...", "en": "..."} — fallback ke ID jika EN kosong */
export type Localized = { id: string; en?: string };

export type NewsCategory = {
  id: string;
  name: Localized;
  slug: string;
};

export type News = {
  id: string;
  title: Localized;
  slug: string;
  excerpt: Localized | null;
  content: Localized;
  thumbnail_url: string | null;
  category: NewsCategory | null;
  author_name: string | null;
  published_at: string;
};

export type Department = {
  id: string;
  name: Localized;
  slug: string;
  description: Localized | null;
  image_url: string | null;
  sort_order: number;
};

export type DepartmentMember = {
  id: string;
  name: string;
  position: Localized;
  photo_url: string | null;
  batch: string | null;
  sort_order: number;
};

export type DepartmentProgram = {
  id: string;
  name: Localized;
  description: Localized | null;
};

export type OrgCategory =
  | "pengurus_inti"
  | "pimpinan"
  | "dewan_pembina"
  | "dewan_pertimbangan";

export type BoardMember = {
  id: string;
  name: string;
  position: Localized;
  photo_url: string | null;
  batch: string | null;
  period: string;
  category: OrgCategory;
  sort_order: number;
};

export type GalleryAlbum = {
  id: string;
  title: Localized;
  slug: string;
  description: Localized | null;
  cover_url: string | null;
  event_date: string | null;
  photo_count?: number;
};

export type GalleryPhoto = {
  id: string;
  image_url: string;
  caption: Localized | null;
  sort_order: number;
};

export type OrgEvent = {
  id: string;
  title: Localized;
  description: Localized | null;
  location: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  type: "proker" | "non_proker";
  department_name: Localized | null;
  status: "upcoming" | "done";
};

// ===== site_content (CMS) =====
export type HeroContent = {
  title: Localized;
  subtitle: Localized;
  description: Localized;
  /** Gambar latar hero (carousel). Kosong → fallback gradien. */
  images: string[];
};

export type StatsContent = {
  founded: number;
  members: number;
  departments: number;
  programs: number;
};

export type ChairmanContent = {
  name: string;
  period: string;
  photo_url: string;
  quote: Localized;
};

export type AboutContent = {
  history: Localized;
  vision: Localized;
  missions: { id: string[]; en?: string[] };
  purpose: { id: string[]; en?: string[] };
  efforts: { id: string[]; en?: string[] };
  logo_philosophy: Localized;
  logo_download_url: string;
  logo_creator: {
    name: string;
    photo_url: string;
    description: Localized;
  };
};

export type ContactContent = {
  address: string;
  email: string;
  phone: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  maps_embed: string;
};

export type SettingsContent = {
  site_name: string;
  registration_open: boolean;
  footer_text: Localized;
};

export type PrivacyContent = {
  content: Localized;
};

export type MarsContent = {
  /** Lirik mars; gunakan baris baru (\n) antar baris, baris kosong antar bait. */
  lyrics: Localized;
  /** URL video YouTube (boleh format watch, youtu.be, atau embed). Kosongkan untuk menyembunyikan. */
  video_url: string;
};

/** Kumpulan seluruh section konten CMS (dipakai editor dashboard). */
export type ContentSections = {
  settings: SettingsContent;
  hero: HeroContent;
  stats: StatsContent;
  chairman: ChairmanContent;
  about: AboutContent;
  contact: ContactContent;
  mars: MarsContent;
  privacy: PrivacyContent;
};
