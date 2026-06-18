# KMP-UNHAS — Website Resmi

Website resmi **Kerukunan Mahasiswa Pinrang Universitas Hasanuddin (KMP-UNHAS)**.
Lihat [PRD.md](PRD.md) untuk spesifikasi lengkap.

Status: **Fase 1 (Fondasi) & Fase 2 (Halaman Publik) selesai.** Fase berikutnya: Auth & Dashboard.

## Tech Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4** + **shadcn/ui**
- **Framer Motion** (animasi), **next-themes** (dark/light), **next-intl** (ID/EN)
- **Supabase** (PostgreSQL + RLS + Storage) — opsional saat dev (ada fallback data demo)

## Struktur

```
web/                      # aplikasi Next.js
  src/
    app/[locale]/         # routing (public) + login + SEO (sitemap, robots, og)
    modules/              # microfrontend per fitur (PRD §2.2): news, events,
                          # gallery, organization, cms, registration, contact
    shared/               # ui, lib, config bersama (kernel)
    i18n/                 # konfigurasi next-intl
  messages/               # id.json, en.json
supabase/migrations/      # 0001_init.sql (skema + RLS), 0002_seed.sql (data demo)
```

## Menjalankan Secara Lokal

```bash
cd web
npm install
npm run dev          # http://localhost:3000
```

Tanpa konfigurasi Supabase, website tampil dengan **data demo** (fallback). Untuk
data nyata + login dashboard, ikuti panduan lengkap di **[SETUP.md](SETUP.md)**
(buat project Supabase, isi `.env.local`, jalankan SQL, buat akun Super Admin pertama).

## Perintah

```bash
npm run dev      # mode pengembangan
npm run build    # build produksi
npm run start    # jalankan hasil build
npm run lint     # ESLint (termasuk aturan batas antar modul)
```

## Bahasa

- Indonesia (default): `/`, `/berita`, ...
- English: `/en`, `/en/berita`, ...

Konten dinamis disimpan dwibahasa; jika terjemahan EN kosong, otomatis fallback ke ID.
