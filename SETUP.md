# Panduan Setup Supabase — KMP-UNHAS

Panduan ini membuat website **berfungsi penuh** (database, login dashboard, form pendaftaran/kontak tersimpan). Tanpa langkah ini, website tetap jalan tetapi memakai **data demo** dan dashboard tidak bisa dipakai (selalu dialihkan ke `/login`).

Perkiraan waktu: ~15 menit. Semua gratis (Supabase free tier).

---

## 1. Buat Project Supabase

1. Buka **https://supabase.com** → **Sign in** (bisa pakai akun GitHub/Google).
   > Disarankan pakai **email organisasi** (mis. `kmpunhas@gmail.com`), bukan email pribadi, agar mudah diserahterimakan antar kepengurusan.
2. Klik **New project**.
3. Isi:
   - **Name**: `kmp-unhas`
   - **Database Password**: buat password kuat, **simpan baik-baik** (dibutuhkan untuk backup).
   - **Region**: **Southeast Asia (Singapore)** — paling dekat dengan Indonesia.
4. Klik **Create new project**, tunggu ±2 menit sampai project siap.

---

## 2. Ambil Kunci API

1. Di project Supabase, buka **Project Settings** (ikon gerigi) → **API**.
2. Catat 3 nilai berikut:
   - **Project URL** → mis. `https://abcd1234.supabase.co`
   - **anon / public key** (kunci panjang, aman dipakai di browser)
   - **service_role key** (kunci RAHASIA — jangan pernah dibagikan / commit)
   > Pada project baru, kunci ada di bagian **"Project API keys"**. Jika tampilan barumu menampilkan "Publishable/Secret", gunakan tab **API Keys (Legacy)** untuk mendapat `anon` & `service_role`.

---

## 3. Isi Environment Variables

1. Di folder `web/`, salin `.env.example` menjadi **`.env.local`**.
   ```bash
   cd web
   cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
   ```
2. Buka `web/.env.local` dan isi:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key dari langkah 2>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key dari langkah 2>
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
   > `.env.local` sudah di-`.gitignore` — aman, tidak akan ter-commit.

---

## 4. Jalankan Skema Database (SQL)

Dijalankan **sekali saja**, berurutan.

1. Di Supabase, buka **SQL Editor** → **New query**.
2. Buka file `supabase/migrations/0001_init.sql` di proyek, **salin seluruh isinya**, tempel ke SQL Editor, klik **Run**.
   → Ini membuat semua tabel, keamanan (RLS), trigger, dan storage bucket.
3. Buat query baru lagi, salin isi `supabase/migrations/0002_seed.sql`, **Run**.
   → Ini mengisi data contoh (kategori, departemen, berita, dll.) supaya halaman tidak kosong.

Jika muncul pesan **"Success. No rows returned"**, berarti berhasil.

---

## 5. Buat Akun Super Admin Pertama (Bootstrap)

Akun login pertama harus dibuat manual (belum ada Super Admin untuk membuatnya).

1. Buka **Authentication** → **Users** → **Add user** → **Create new user**.
2. Isi **Email** + **Password** (yang akan Anda pakai login), centang **Auto Confirm User**, lalu **Create user**.
3. Buka **SQL Editor**, jalankan isi file **`supabase/bootstrap-admin.sql`** setelah mengganti email & nama di dalamnya:
   ```sql
   insert into public.profiles (id, full_name, role, is_active)
   select u.id, 'Nama Ketua', 'super_admin', true
   from auth.users u
   where u.email = 'email-anda@contoh.com'
   on conflict (id) do update
     set role = 'super_admin', full_name = excluded.full_name, is_active = true;
   ```
   > Memakai UPSERT agar tetap berhasil walau baris profil belum ada. Query verifikasi ada di file tersebut.

---

## 6. Jalankan & Login

1. Jalankan aplikasi:
   ```bash
   cd web
   npm run dev
   ```
2. Buka **http://localhost:3000** → website kini memakai data dari Supabase.
3. Buka **http://localhost:3000/login** (endpoint sengaja tidak ditaut di menu) → login dengan email & password dari langkah 5.
4. Berhasil → Anda masuk **Dashboard** sebagai Super Admin. Akun Admin/Panitia berikutnya tinggal dibuat dari menu **Manajemen Akun**.

---

## 7. (Opsional) Email & Google Login

- **Custom SMTP (disarankan sebelum rilis)** — agar reset password & undangan akun tidak kena limit email bawaan Supabase. Authentication → Settings → SMTP, isi dengan **Resend** (gratis 100 email/hari). Lihat PRD §14.1.
- **Google Login (untuk komentar publik — Fase 4, belum aktif)** — Authentication → Providers → Google, lalu tambahkan redirect URL `http://localhost:3000/auth/callback` (dan domain produksi nanti). Belum perlu sekarang.

---

## Catatan

- **Tanpa `SUPABASE_SERVICE_ROLE_KEY`**, semua jalan KECUALI pembuatan akun dari dashboard (Manajemen Akun).
- Setiap mengubah `.env.local`, **restart** `npm run dev`.
- Untuk produksi (Vercel): isi environment variables yang sama di dashboard Vercel, dan ganti `NEXT_PUBLIC_SITE_URL` ke domain asli.
- Free tier Supabase mem-pause project bila tak ada aktivitas ±1 minggu — lihat mitigasi di PRD §14.1.
