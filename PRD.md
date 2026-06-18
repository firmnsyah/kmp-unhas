# PRD — Website KMP-UNHAS

**Product Requirements Document**
Website Resmi Kerukunan Mahasiswa Pinrang Universitas Hasanuddin (KMP-UNHAS)

| | |
|---|---|
| **Versi** | 1.2 |
| **Tanggal** | 11 Juni 2026 |
| **Status** | Draft — menunggu persetujuan pengurus |

> **Changelog v1.1**: penambahan Form Dinamis (form builder + share + deadline + ekspor Excel/CSV), Proker pada Agenda, dukungan multibahasa (ID/EN), komentar berita & pengisian form oleh User Publik (login Google), dan social share preview (Open Graph banner).
> **Changelog v1.2**: komentar berita kini mendukung **balasan berantai (threaded reply)** dan **reaksi emoji**.
> **Changelog v1.3**: penambahan **Framer Motion** (animasi) ke tech stack serta alat bantu pengembangan UI (**ui-ux-pro-max skill** & **21st.dev**).
> **Changelog v1.4**: penambahan arsitektur frontend ber-**prinsip microfrontend** (§2.2) dan strategi **Lighthouse hijau semua kategori** (§10.1).
> **Changelog v1.5**: halaman **Kebijakan Privasi** + consent (§4.11), batasan upload file form, slug permanen, soft delete & **audit log**, email via **Resend**, monitoring, serta section baru **Operasional & Keberlanjutan** (§14).

---

## 1. Pendahuluan

### 1.1 Latar Belakang

KMP-UNHAS (Kerukunan Mahasiswa Pinrang Universitas Hasanuddin) adalah organisasi kedaerahan yang menaungi mahasiswa asal Kabupaten Pinrang yang berkuliah di Universitas Hasanuddin. Saat ini informasi organisasi (kegiatan, berita, struktur kepengurusan) tersebar di media sosial dan belum memiliki wadah resmi yang terpusat.

Website ini dibangun sebagai **pusat informasi resmi** organisasi sekaligus **sistem manajemen konten internal** sehingga pengurus dapat memperbarui seluruh isi website tanpa perlu menyentuh kode.

### 1.2 Tujuan

1. Menyediakan profil resmi organisasi yang mudah diakses publik (sejarah, visi misi, struktur, departemen).
2. Menjadi kanal publikasi berita dan dokumentasi kegiatan (proker, non-proker, alumni, pengumuman).
3. Mempermudah mahasiswa baru asal Pinrang mendaftar sebagai anggota.
4. Memberikan sistem dashboard berjenjang (Super Admin, Admin, Panitia) dengan alur approval konten yang jelas.
5. Memungkinkan Super Admin mengubah konten semua halaman publik melalui dashboard (CMS) tanpa mengubah kode.
6. Menyediakan **form dinamis** (pendaftaran kegiatan, survei, dll.) yang dapat dibuat, dibagikan, dan direkap pengurus tanpa bantuan developer.
7. Meningkatkan keterlibatan publik melalui komentar berita (login Google) dan konten dwibahasa (ID/EN).

### 1.3 Target Pengguna

| Pengguna | Kebutuhan |
|---|---|
| **Publik / Mahasiswa baru** | Mengenal organisasi, membaca berita, melihat agenda & galeri, mendaftar anggota, menghubungi pengurus |
| **User Publik (login Google)** | Berkomentar di berita dan mengisi form dinamis; **tidak memiliki akses dashboard** |
| **Panitia kegiatan** | Mengunggah berita/dokumentasi kegiatan yang ditangani |
| **Admin (Pengurus)** | Mengelola berita, meninjau (approve/reject) berita panitia, mengelola akun panitia |
| **Super Admin (Ketua)** | Kontrol penuh: semua kemampuan Admin & Panitia + mengelola semua akun + mengedit konten seluruh halaman website |

---

## 2. Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | **Next.js 15+ (App Router)** + TypeScript | SSR/ISR untuk halaman publik, Server Actions untuk mutasi data |
| UI | **Tailwind CSS** + **shadcn/ui** | Seluruh komponen UI menggunakan shadcn/ui |
| Animasi | **Framer Motion** (`motion`) | Animasi halaman publik & micro-interaction (lihat §3.4) |
| Tema | **next-themes** | Dark & light mode |
| Backend / DB | **Supabase** | PostgreSQL + Row Level Security (RLS) |
| Autentikasi | **Supabase Auth** | Internal: email + password (dashboard). User Publik: **Google OAuth**. Session via `@supabase/ssr` |
| Penyimpanan file | **Supabase Storage** | Gambar berita, foto galeri, foto pengurus, logo |
| Form & validasi | **react-hook-form** + **zod** | Validasi client & server |
| Rich text editor | **Tiptap** | Editor konten berita di dashboard |
| Multibahasa | **next-intl** | Bahasa Indonesia (default) & English, routing `/{locale}` |
| Ekspor data | **SheetJS (xlsx)** | Unduh hasil form & data pendaftar sebagai Excel/CSV |
| Email transaksional | **Resend** (custom SMTP Supabase Auth) | Reset password & undangan akun — menghindari limit SMTP bawaan Supabase (±2–4 email/jam) |
| Monitoring | **Sentry** + **Vercel Analytics & Speed Insights** | Error tracking + data pengunjung & Core Web Vitals lapangan |
| Deployment | **Vercel** | CI/CD otomatis dari repository |

### 2.1 Alat Bantu Pengembangan UI

Selama pengembangan, kualitas UI/UX dijaga dengan alat berikut (proses develop, bukan dependensi runtime):

- **ui-ux-pro-max skill** — panduan & review desain UI/UX (hierarki visual, spacing, tipografi, pola interaksi) untuk setiap halaman yang dibangun.
- **21st.dev (Magic MCP)** — inspirasi dan generator komponen React/Tailwind berkualitas tinggi; komponen hasil generate disesuaikan dengan design token shadcn (merah/biru, dark/light) sebelum dipakai.

### 2.2 Arsitektur Frontend — Prinsip Microfrontend

Aplikasi dibangun sebagai **modular monolith dengan prinsip microfrontend**: satu deployment Next.js, tetapi kode diorganisasi sebagai modul fitur yang mandiri dan berbatas tegas — sehingga tiap modul dapat dikembangkan, diuji, dan dimuat secara independen.

**Struktur modul (vertical slice per fitur):**

```
src/
├── modules/                  # satu folder = satu "microfrontend"
│   ├── news/                 # berita + komentar + reaksi
│   ├── forms/                # form dinamis (builder, respons, ekspor)
│   ├── gallery/
│   ├── events/               # agenda + proker
│   ├── organization/         # struktur kepengurusan + departemen
│   ├── registration/         # pendaftaran anggota
│   ├── contact/
│   ├── cms/                  # konten website (Super Admin)
│   ├── accounts/             # manajemen akun
│   └── auth/                 # login internal + Google OAuth
│   └── (tiap modul: components/ actions/ hooks/ queries/ types/ index.ts)
├── shared/                   # kernel bersama
│   ├── ui/                   # komponen shadcn + design token + animasi dasar
│   ├── lib/                  # supabase client, i18n, utils
│   └── config/
└── app/                      # routing tipis — hanya merangkai modul
```

**Aturan batas modul:**

- Modul **tidak boleh mengimpor internal modul lain** — hanya lewat public API (`index.ts`) atau `shared/`; ditegakkan dengan aturan ESLint (`import/no-internal-modules` / boundaries).
- Setiap modul memiliki komponen, server actions, query, dan tipe datanya sendiri (vertical slice) — menambah/mengubah satu fitur tidak menyentuh modul lain.
- **Lazy loading per modul**: bagian berat (form builder, editor Tiptap, lightbox galeri, chart) dimuat via `dynamic()` hanya saat dibutuhkan, sehingga tiap halaman hanya membawa JS modulnya sendiri.
- Halaman publik dan dashboard adalah **route group terpisah** (`app/(public)` dan `app/(dashboard)`) dengan layout, bundle, dan guard masing-masing.
- **Jalur evolusi**: jika kelak butuh pemisahan nyata (mis. dashboard sebagai aplikasi terpisah), struktur modul ini dapat diekstrak ke **Next.js Multi-Zones** tanpa menulis ulang — batas modul sudah bersih sejak awal.

---

## 3. Design System

### 3.1 Tema & Warna

- **Dark mode & light mode** — toggle tersedia di navbar (ikon matahari/bulan), preferensi tersimpan (default mengikuti sistem).
- **Accent color: Merah & Biru** (warna identitas organisasi):
  - **Merah** → `primary` (tombol utama, link aktif, badge kategori, highlight)
  - **Biru** → `secondary`/aksen pendamping (gradien hero, hover state, elemen dekoratif, chart dashboard)
- Warna dipetakan ke CSS variables tema shadcn/ui (`--primary`, `--secondary`, dst.) di `globals.css` untuk kedua mode sehingga konsisten di seluruh komponen.

Contoh palet (dapat disesuaikan dengan logo asli organisasi):

| Token | Light | Dark |
|---|---|---|
| `primary` (merah) | `#DC2626` | `#EF4444` |
| `secondary` (biru) | `#1D4ED8` | `#3B82F6` |
| `background` | `#FFFFFF` | `#0A0A0A` |

### 3.2 Komponen shadcn/ui yang digunakan

`navigation-menu` (navbar + dropdown Struktur Organisasi), `button`, `card`, `badge`, `tabs`, `dialog`, `alert-dialog`, `dropdown-menu`, `table` + `data-table`, `form`, `input`, `textarea`, `select`, `calendar`, `avatar`, `sidebar`, `sheet` (menu mobile), `sonner` (toast notifikasi), `skeleton` (loading state), `pagination`, `breadcrumb`, `chart` (statistik dashboard).

### 3.3 Prinsip Desain

- **Mobile-first & fully responsive** (navbar berubah menjadi hamburger + sheet di mobile).
- Konsisten: satu sumber token warna/spacing untuk halaman publik dan dashboard.
- Loading state dengan `skeleton`, feedback aksi dengan toast `sonner`.

### 3.4 Animasi & Interaksi (Framer Motion)

- **Scroll reveal**: section halaman publik muncul dengan fade/slide halus saat di-scroll (`whileInView`).
- **Hero beranda**: animasi masuk bertahap (stagger) untuk judul, tagline, dan CTA; angka statistik dianimasikan menghitung naik (count-up).
- **Micro-interaction**: hover/tap pada kartu (berita, departemen, galeri, form) — lift & shadow halus; transisi reaksi emoji komentar.
- **Transisi UI**: dropdown navbar, tab, dialog/lightbox galeri, dan countdown deadline form menggunakan transisi `AnimatePresence`.
- **Batasan**: animasi subtil dan cepat (≤ 400ms), tidak menghalangi konten, menghormati `prefers-reduced-motion`, dan tidak menurunkan skor performa (lazy/viewport-based, hindari layout thrashing). Dashboard memakai animasi minimal (fokus produktivitas).

---

## 4. Halaman Publik

Navigasi utama (navbar): **Beranda · Tentang · Struktur Organisasi ▾ · Berita · Galeri · Agenda · Kontak** + tombol **Daftar Anggota** (CTA) + toggle tema + **switcher bahasa (ID/EN)** + tombol **Login** (dropdown: "Login Pengurus" → `/login`, "Login dengan Google" → user publik).

> **Penting:** Seluruh teks, gambar, dan data pada halaman publik bersumber dari database (tabel `site_content` dan tabel terkait) sehingga Super Admin dapat mengubahnya melalui dashboard tanpa menyentuh kode. Seluruh halaman publik tersedia dalam **dua bahasa (ID/EN)** — lihat §4.10.

### 4.1 Beranda (`/`)

| Section | Konten |
|---|---|
| Hero | Judul, tagline, deskripsi singkat, gambar/ilustrasi, CTA "Daftar Anggota" & "Tentang Kami" |
| Sambutan Ketua | Foto ketua, nama, periode, kutipan sambutan |
| Statistik | Jumlah anggota, departemen, proker terlaksana, tahun berdiri (angka dikelola dari CMS) |
| Berita Terbaru | 3–6 kartu berita published terbaru → link ke `/berita` |
| Agenda Mendatang | 3 kegiatan terdekat → link ke `/agenda` |
| **Form Aktif** | Kartu form dinamis yang **deadline-nya masih berlaku** (judul, deskripsi singkat, countdown deadline, tombol "Isi Form"). Form **otomatis tersembunyi** dari beranda setelah melewati deadline; muncul kembali jika deadline di-extend |
| Preview Galeri | Grid 6–8 foto terbaru → link ke `/galeri` |
| CTA Pendaftaran | Banner ajakan mendaftar bagi mahasiswa baru asal Pinrang |

### 4.2 Tentang (`/tentang`)

- Sejarah organisasi (rich text).
- Visi & Misi.
- Filosofi logo (gambar logo + penjelasan).

### 4.3 Struktur Organisasi (dropdown di navbar)

#### 4.3.1 Struktur Kepengurusan (`/struktur/kepengurusan`)

- Bagan/grid pengurus inti per periode: Ketua, Wakil Ketua, Sekretaris, Bendahara, serta jajaran lainnya.
- Setiap pengurus: foto, nama, jabatan, angkatan.
- Data dikelola dari dashboard (tabel `org_structure`), mendukung pergantian periode kepengurusan.

#### 4.3.2 Departemen (`/struktur/departemen`)

- Daftar semua departemen (kartu: nama, ikon/gambar, deskripsi singkat).
- Halaman detail per departemen (`/struktur/departemen/[slug]`): deskripsi, kepala departemen & anggota, daftar program kerja.
- Jumlah dan isi departemen **dinamis** — Super Admin dapat menambah/mengubah/menghapus departemen dari dashboard.

### 4.4 Berita (`/berita`)

- **List berita** published: kartu (thumbnail, judul, kategori, tanggal, penulis, excerpt).
- **Filter kategori** via tabs/badge: **Proker, Non-Proker, Alumni, Pengumuman**, dan kategori lain (kategori dinamis, dikelola dari dashboard).
- **Pencarian** berdasarkan judul/isi.
- **Pagination**.
- **Detail berita** (`/berita/[slug]`): judul, gambar utama, kategori, penulis, tanggal, konten rich text, tombol share ke media sosial, berita terkait (kategori sama).
- **Komentar berita**:
  - User publik dapat berkomentar **setelah login dengan akun Google** (avatar & nama dari Google).
  - Pengunjung yang belum login melihat komentar tetapi tombol komentar/balas/reaksi mengarah ke "Login dengan Google".
  - **Balasan berantai (threaded reply)**: setiap komentar dapat dibalas; balasan tampil menjorok di bawah komentar induk (kedalaman maksimal 1 level — balasan terhadap balasan tetap berada di thread yang sama dengan mention `@nama` penulis yang dibalas). Thread panjang diciutkan dengan tombol "Lihat N balasan".
  - **Reaksi**: setiap komentar/balasan dapat diberi reaksi emoji (👍 ❤️ 😂 😮 😢) — satu reaksi per user per komentar, dapat diganti atau dibatalkan; jumlah tiap reaksi tampil di bawah komentar.
  - User dapat mengedit/menghapus komentar & balasannya sendiri; menghapus komentar induk turut menyembunyikan balasannya. Admin & Super Admin dapat menghapus/menyembunyikan komentar apa pun (moderasi dari dashboard).
  - Komentar diurutkan terbaru/terpopuler (jumlah reaksi + balasan).
  - Akun Google (user publik) **tidak bisa mengakses dashboard**.

### 4.5 Galeri (`/galeri`)

- Daftar album kegiatan (cover, judul, tanggal, jumlah foto).
- Detail album (`/galeri/[slug]`): grid foto dengan lightbox (dialog shadcn).

### 4.6 Agenda (`/agenda`)

- Daftar kegiatan **mendatang** dan **selesai** (tabs).
- Setiap agenda memiliki **jenis kegiatan: Proker / Non-Proker** — agenda proker terhubung dengan program kerja departemen (`department_programs`) sehingga publik dapat melihat proker mana yang akan dan sudah terlaksana.
- Filter berdasarkan jenis (Semua / Proker / Non-Proker) dan departemen penyelenggara.
- Setiap agenda: judul, jenis, departemen penyelenggara (untuk proker), tanggal & waktu, lokasi, deskripsi, status, gambar opsional.
- Opsional: tampilan kalender (komponen `calendar`).

### 4.7 Pendaftaran Anggota (`/pendaftaran`)

- Form publik (tanpa login) untuk mahasiswa baru asal Pinrang:
  - Nama lengkap, NIM, fakultas/jurusan, angkatan, asal sekolah/kecamatan di Pinrang, email, no. WhatsApp, alasan bergabung.
- Validasi zod, proteksi spam sederhana (honeypot + rate limit).
- Setelah submit: halaman/toast konfirmasi; data masuk ke dashboard (menu Pendaftar) dengan status `baru / dihubungi / diterima / ditolak`.
- Super Admin dapat membuka/menutup pendaftaran dari CMS (jika ditutup, tampilkan pengumuman).

### 4.8 Kontak (`/kontak`)

- Alamat sekretariat, email, no. telepon/WA.
- Link media sosial (Instagram, dll.).
- Form kirim pesan (nama, email, subjek, pesan) → tersimpan ke database, terbaca di dashboard.
- Embed Google Maps lokasi sekretariat.

### 4.9 Form Dinamis (`/form/[slug]`)

Halaman publik untuk mengisi form yang dibuat Super Admin/Admin (mis. pendaftaran panitia, survei, pendataan, RSVP kegiatan).

- **Akses**: pengisi **wajib login dengan akun Google (user publik)** terlebih dahulu — identitas pengisi (nama & email Google) tercatat otomatis di setiap respons.
- **Tampilan**: judul, deskripsi, banner opsional, deadline (countdown), lalu daftar pertanyaan sesuai rancangan form.
- **Jenis field yang didukung**: teks singkat, teks panjang, angka, email, no. HP, pilihan ganda (radio), kotak centang (checkbox), dropdown, tanggal, dan upload file (opsional, ke Supabase Storage — **dibatasi**: tipe `pdf/jpg/png/docx`, maks **5MB per file**, 1 file per pertanyaan, hanya user login; mencegah penyalahgunaan storage).
- **Aturan deadline**:
  - Form hanya bisa diisi selama deadline belum lewat dan status form aktif.
  - Setelah deadline lewat: form **otomatis tertutup** — halaman menampilkan pesan "form sudah ditutup", dan kartunya **disembunyikan dari beranda**.
  - Deadline dapat **di-extend** oleh pembuatnya (Super Admin/Admin) dari dashboard; form yang sudah tertutup otomatis terbuka dan tampil kembali di beranda.
- **Berbagi**: setiap form memiliki **link unik yang dapat dibagikan** (tombol salin link + share WhatsApp/media sosial dari dashboard), lengkap dengan social preview (judul, deskripsi, banner — lihat §10 SEO).
- Satu user dapat dibatasi **satu respons per form** (opsi diatur pembuat form), dengan opsi mengizinkan edit respons sebelum deadline.

### 4.10 Multibahasa (ID/EN)

- Seluruh halaman publik tersedia dalam **Bahasa Indonesia (default)** dan **English** dengan routing `next-intl` (`/...` untuk ID, `/en/...` untuk EN) dan switcher bahasa di navbar.
- Teks statis UI (label, tombol, navigasi) dikelola lewat file pesan `next-intl` (`id.json`, `en.json`).
- Konten dinamis (berita, konten CMS, departemen, agenda, form) memiliki **kolom dwibahasa** (`title_id`/`title_en`, dst. atau JSONB per-locale) — kolom EN bersifat **opsional**; jika kosong, sistem menampilkan versi ID sebagai fallback agar pengurus tidak wajib menerjemahkan semuanya.
- Editor di dashboard menampilkan tab **ID / EN** untuk setiap field konten yang diterjemahkan.

### 4.11 Kebijakan Privasi (`/privasi`)

- Halaman statis berisi kebijakan pengelolaan data pribadi (data pendaftar: NIM, no. WA; data user Google: nama, email, avatar) — konten dikelola dari CMS, link di footer.
- **Wajib ada sebelum rilis** karena: (1) Google OAuth consent screen mensyaratkan URL kebijakan privasi & domain terverifikasi, dan (2) kepatuhan dasar UU PDP atas data pribadi yang dikumpulkan.
- Form pendaftaran anggota dan form dinamis menampilkan **checkbox persetujuan** ("Saya menyetujui pengolahan data sesuai Kebijakan Privasi") sebelum submit.

---

## 5. Autentikasi

Terdapat **dua jalur autentikasi terpisah**:

### 5.1 Akun Internal (Pengurus — akses dashboard)

- Halaman **`/login`**: email + password (Supabase Auth), tampilan card shadcn dengan logo organisasi.
- **Tidak ada registrasi publik** — akun dibuat oleh Super Admin (semua role) atau Admin (khusus akun Panitia).
- Lupa password: reset via email (Supabase Auth).
- Setelah login, pengguna diarahkan ke `/dashboard`; route `/dashboard/**` diproteksi middleware (redirect ke `/login` jika belum login, dan pembatasan menu sesuai role).

### 5.2 User Publik (Google OAuth — tanpa akses dashboard)

- Login dengan **akun Google** (Supabase Auth Google OAuth) melalui tombol "Login dengan Google" di navbar, di kolom komentar berita, atau saat membuka halaman form.
- Tujuan login: **berkomentar di berita** dan **mengisi form dinamis** — tidak ada kemampuan lain.
- User publik **tidak dapat mengakses `/dashboard`** — middleware menolak role `public` dan mengarahkan kembali ke beranda.
- Profil otomatis dibuat dari data Google (nama, avatar, email) dengan role `public`.
- User publik dapat logout dan melihat riwayat respons form miliknya (halaman sederhana `/akun`).

### 5.3 Penegakan Role

- Role disimpan di tabel `profiles` (`super_admin` | `admin` | `panitia` | `public`) dan ditegakkan di tiga lapis: middleware, Server Actions, dan RLS database.
- Login Google selalu menghasilkan role `public` — role internal tidak pernah diberikan lewat OAuth, sehingga tidak ada jalur eskalasi dari akun Google ke dashboard.

---

## 6. Role & Permission

### 6.1 Definisi Role

| Role | Pemegang | Ringkasan |
|---|---|---|
| **Super Admin** | Ketua | Kontrol penuh seluruh sistem |
| **Admin** | Pengurus inti/kepengurusan | Kelola berita & akun panitia, approval berita, form dinamis |
| **Panitia** | Panitia kegiatan | Kelola berita milik sendiri (perlu approval) |
| **User Publik** | Pengunjung (login Google) | Komentar berita & isi form dinamis — **tanpa akses dashboard** |

### 6.2 Matriks Permission

| Kemampuan | Super Admin | Admin | Panitia |
|---|:---:|:---:|:---:|
| Membuat/mengedit/menghapus berita **milik sendiri** | ✅ (langsung publish) | ✅ (langsung publish) | ✅ (masuk antrian approval) |
| Approve / reject berita panitia | ✅ | ✅ | ❌ |
| CRUD **semua** berita (milik siapa pun) | ✅ | ✅ | ❌ |
| Mengelola kategori berita | ✅ | ✅ | ❌ |
| Membuat & mengelola akun **Panitia** | ✅ | ✅ | ❌ |
| Membuat & mengelola **semua akun** (termasuk Admin) | ✅ | ❌ | ❌ |
| Mengedit konten **semua halaman publik** (CMS) | ✅ | ❌ | ❌ |
| Mengelola struktur kepengurusan & departemen | ✅ | ❌ | ❌ |
| Mengelola galeri & agenda (termasuk proker) | ✅ | ✅ | ❌ |
| Membuat, mengedit, membagikan form dinamis & extend deadline | ✅ | ✅ | ❌ |
| Melihat hasil form & unduh Excel/CSV | ✅ | ✅ | ❌ |
| Moderasi komentar berita (hapus/sembunyikan) | ✅ | ✅ | ❌ |
| Melihat & mengelola data pendaftar anggota | ✅ | ✅ | ❌ |
| Membaca pesan kontak | ✅ | ✅ | ❌ |
| Mengubah profil & password sendiri | ✅ | ✅ | ✅ |

**User Publik** (login Google, tidak masuk tabel di atas karena tanpa dashboard): menulis/mengedit/menghapus komentar & balasan miliknya sendiri, membalas komentar lain, memberi/mengganti/membatalkan reaksi pada komentar, mengisi form dinamis yang masih aktif, melihat riwayat respons form miliknya.

> Super Admin tidak dapat dihapus/diturunkan oleh siapa pun selain dirinya (minimal harus selalu ada 1 Super Admin).

---

## 7. Workflow Berita

```
                    ┌──────────────────────────────────────┐
                    │ Penulis = Admin / Super Admin        │
  Draft ───────────►│ → langsung Published                 │
    │               └──────────────────────────────────────┘
    │ (Panitia submit)
    ▼
 Pending Review ──► Approve (Admin/Super Admin) ──► Published
    │
    └─────────────► Reject + catatan revisi ──► Rejected
                                                  │
                       Panitia memperbaiki ◄──────┘
                       lalu submit ulang → Pending Review
```

- Status berita: `draft` → `pending` → `published` / `rejected`.
- Saat reject, reviewer **wajib mengisi catatan revisi** yang terlihat oleh panitia penulis.
- Berita published dapat ditarik kembali (unpublish) oleh Admin/Super Admin.
- **Slug permanen**: slug dikunci saat pertama kali published — judul boleh diedit, slug tidak berubah, sehingga link yang sudah tersebar tidak pernah mati.
- **Soft delete**: menghapus berita mengisi `deleted_at` (tidak benar-benar terhapus); pemulihan & hapus permanen hanya oleh Super Admin.
- Penjadwalan publish (scheduled publish) **tidak termasuk v1** (lihat §12).
- Setiap berita mencatat: penulis, reviewer, waktu publish.

---

## 8. Dashboard

Layout: **shadcn Sidebar** (collapsible) + header (breadcrumb, toggle tema, avatar dropdown: profil & logout). Menu sidebar menyesuaikan role.

### 8.1 Menu per Role

| Menu | Super Admin | Admin | Panitia |
|---|:---:|:---:|:---:|
| **Overview** — statistik (total berita, pending approval, pendaftar baru, pesan masuk) + aktivitas terbaru | ✅ | ✅ | ✅ (statistik berita sendiri) |
| **Berita** — data-table CRUD + editor Tiptap + upload thumbnail | semua berita | semua berita | berita sendiri |
| **Approval Berita** — antrian pending, preview, approve/reject + catatan | ✅ | ✅ | ❌ |
| **Kategori Berita** — CRUD kategori | ✅ | ✅ | ❌ |
| **Galeri** — CRUD album & upload multi-foto | ✅ | ✅ | ❌ |
| **Agenda** — CRUD kegiatan (jenis Proker/Non-Proker, relasi ke proker departemen) | ✅ | ✅ | ❌ |
| **Form Dinamis** — builder, hasil respons, ekspor Excel/CSV, share link, extend deadline (lihat §8.3) | ✅ | ✅ | ❌ |
| **Komentar** — moderasi komentar & balasan berita (lihat per thread, sembunyikan, hapus) | ✅ | ✅ | ❌ |
| **Pendaftar** — data-table pendaftar, ubah status, ekspor Excel/CSV | ✅ | ✅ | ❌ |
| **Pesan Kontak** — inbox pesan dari halaman kontak | ✅ | ✅ | ❌ |
| **Manajemen Akun** — buat/edit/nonaktifkan akun + reset password | semua akun | akun panitia saja | ❌ |
| **Konten Website (CMS)** | ✅ | ❌ | ❌ |
| **Struktur Organisasi** — CRUD pengurus & departemen + periode | ✅ | ❌ | ❌ |
| **Log Aktivitas** — riwayat aksi penting (publish/approve/hapus berita, perubahan akun & CMS) | ✅ | ❌ | ❌ |
| **Pengaturan Profil** — nama, foto, password | ✅ | ✅ | ✅ |

### 8.2 Konten Website / CMS (khusus Super Admin)

Halaman editor per-section sehingga perubahan konten **tidak memerlukan perubahan kode**:

- **Beranda**: teks hero, sambutan ketua, angka statistik, banner CTA.
- **Tentang**: sejarah, visi misi, filosofi logo.
- **Kontak**: alamat, email, telepon, link sosmed, embed maps.
- **Kebijakan Privasi**: konten halaman `/privasi`.
- **Pengaturan umum**: nama situs, logo, favicon, teks footer, status buka/tutup pendaftaran.

Implementasi: tabel `site_content` (key per section, value JSONB) — halaman publik membaca dari tabel ini dengan revalidasi (ISR/`revalidatePath`) saat konten disimpan. Setiap field konten yang diterjemahkan memiliki tab **ID/EN** (lihat §4.10).

### 8.3 Modul Form Dinamis (Super Admin & Admin)

**Builder (buat/edit form):**

- Field form: judul, deskripsi, banner opsional, **deadline (tanggal & jam)**, status (aktif/nonaktif), opsi "tampilkan di beranda", opsi "satu respons per user", opsi "izinkan edit respons sebelum deadline".
- Penyusun pertanyaan drag-and-drop sederhana: tambah/hapus/urutkan pertanyaan, pilih jenis field (teks singkat/panjang, angka, email, no. HP, radio, checkbox, dropdown, tanggal, upload file), tandai wajib/opsional.
- Preview form sebelum dipublikasikan.

**Hasil & rekap:**

- Data-table respons: identitas pengisi (nama & email Google), waktu submit, dan seluruh jawaban.
- Ringkasan jumlah respons + grafik sederhana untuk pertanyaan pilihan (komponen `chart`).
- Tombol **Unduh Excel (.xlsx)** dan **Unduh CSV** — seluruh respons dengan satu kolom per pertanyaan.

**Distribusi & deadline:**

- Tombol **Salin Link** (`/form/[slug]`) dan share cepat ke WhatsApp/media sosial; link menampilkan social preview (judul, deskripsi, banner form).
- **Extend deadline**: ubah tanggal deadline kapan pun — form yang sudah tertutup otomatis terbuka kembali dan tampil lagi di beranda.
- Tutup manual lebih awal dengan menonaktifkan form.
- Admin dapat mengelola form buatannya sendiri; Super Admin dapat mengelola semua form.

---

## 9. Skema Database (Supabase / PostgreSQL)

### 9.1 Tabel

| Tabel | Kolom utama | Keterangan |
|---|---|---|
| `profiles` | id (= auth.users.id), full_name, avatar_url, role (`super_admin`/`admin`/`panitia`/`public`), is_active, created_at | Profil & role pengguna; role `public` dibuat otomatis saat login Google |
| `news_categories` | id, name, slug | Kategori dinamis (Proker, Non-Proker, Alumni, Pengumuman, …) |
| `news` | id, title, slug (**permanen setelah publish**), excerpt, content (rich text), thumbnail_url, category_id, author_id, status (`draft`/`pending`/`published`/`rejected`), review_note, reviewed_by, published_at, **deleted_at (soft delete)**, created_at, updated_at | Berita + alur approval |
| `departments` | id, name, slug, description, image_url, sort_order | Departemen |
| `department_members` | id, department_id, name, position, photo_url, batch (angkatan), sort_order | Anggota departemen |
| `department_programs` | id, department_id, name, description | Program kerja departemen |
| `org_structure` | id, name, position, photo_url, batch, period (mis. "2025/2026"), sort_order | Pengurus inti per periode |
| `site_content` | key (PK, mis. `home_hero`, `about`, `contact`, `settings`), value (JSONB), updated_by, updated_at | Konten CMS halaman publik |
| `gallery_albums` | id, title, slug, description, cover_url, event_date | Album galeri |
| `gallery_photos` | id, album_id, image_url, caption, sort_order | Foto dalam album |
| `events` | id, title, description, location, start_at, end_at, image_url, type (`proker`/`non_proker`), department_id (nullable), program_id (nullable → `department_programs`), status (`upcoming`/`done`) | Agenda kegiatan; agenda proker terhubung ke proker departemen |
| `forms` | id, title, slug, description, banner_url, deadline_at, is_active, show_on_home, one_response_per_user, allow_edit_response, created_by, created_at | Form dinamis; tampil di beranda selama `is_active` dan `deadline_at` belum lewat |
| `form_questions` | id, form_id, label, type (`short_text`/`long_text`/`number`/`email`/`phone`/`radio`/`checkbox`/`dropdown`/`date`/`file`), options (JSONB), is_required, sort_order | Pertanyaan per form |
| `form_responses` | id, form_id, user_id (user publik Google), answers (JSONB: question_id → jawaban), created_at, updated_at | Respons form; unik per (form_id, user_id) jika satu-respons-per-user aktif |
| `news_comments` | id, news_id, user_id, **parent_id (nullable → `news_comments.id`)**, **reply_to_user_id (nullable, untuk mention `@nama`)**, content, is_hidden, created_at, updated_at | Komentar & balasan berita; `parent_id` terisi = balasan (thread 1 level) |
| `comment_reactions` | id, comment_id, user_id, emoji (`like`/`love`/`haha`/`wow`/`sad`), created_at — **unik per (comment_id, user_id)** | Reaksi emoji pada komentar; satu reaksi per user per komentar |
| `registrations` | id, full_name, nim, faculty, major, batch, origin (kecamatan/sekolah), email, whatsapp, reason, status (`baru`/`dihubungi`/`diterima`/`ditolak`), created_at | Pendaftar anggota baru |
| `contact_messages` | id, name, email, subject, message, is_read, created_at | Pesan dari halaman kontak |
| `activity_logs` | id, actor_id, action, entity (nama tabel), entity_id, detail (JSONB), created_at | Audit log aksi penting: publish/approve/reject/hapus berita, perubahan akun, perubahan CMS, extend deadline form |

> **Multibahasa**: kolom konten yang diterjemahkan (mis. `title`, `description`, `content` pada `news`, `departments`, `events`, `site_content`, `forms`) disimpan dwibahasa — pasangan kolom `_id`/`_en` atau JSONB `{id, en}` — dengan fallback ke ID jika EN kosong (lihat §4.10).

### 9.2 Storage Buckets

- `news` (thumbnail & gambar konten berita), `gallery` (foto album), `people` (foto pengurus/anggota), `site` (logo, gambar hero, dll.), `forms` (banner form & file upload dari respons).

### 9.3 Ringkasan Kebijakan RLS

| Tabel | SELECT (publik) | INSERT/UPDATE/DELETE |
|---|---|---|
| `news` | hanya `status = 'published'`; penulis melihat miliknya; admin+ melihat semua | Panitia: CRUD milik sendiri (status hanya `draft`/`pending`); Admin & Super Admin: semua + ubah status |
| `news_categories`, `gallery_*`, `events` | ✅ semua | Admin & Super Admin |
| `news_comments` | ✅ hanya yang `is_hidden = false` (balasan ikut tersembunyi jika induknya disembunyikan) | User publik: insert/update/delete komentar & balasan miliknya sendiri (wajib login Google); Admin & Super Admin: hapus/sembunyikan semua |
| `comment_reactions` | ✅ semua (agregat jumlah per emoji) | User publik: insert/update/delete reaksi miliknya sendiri (wajib login Google) |
| `forms`, `form_questions` | ✅ hanya form aktif & belum lewat deadline | Admin: CRUD form miliknya; Super Admin: semua form |
| `form_responses` | ❌ — user publik hanya membaca respons miliknya | User publik: insert (hanya saat form aktif & sebelum deadline) + update miliknya jika diizinkan; Admin & Super Admin: baca semua respons |
| `departments`, `department_*`, `org_structure`, `site_content` | ✅ semua | Super Admin |
| `registrations` | ❌ (insert publik diizinkan) | Admin & Super Admin (baca/ubah status) |
| `contact_messages` | ❌ (insert publik diizinkan) | Admin & Super Admin (baca/tandai dibaca) |
| `profiles` | pengguna membaca miliknya; admin+ membaca sesuai cakupan | Super Admin: semua; Admin: akun panitia; pembuatan akun via Server Action dengan service role; role `public` dibuat otomatis via trigger saat sign-in Google |
| `activity_logs` | ❌ — hanya Super Admin | Insert otomatis via Server Actions (append-only, tidak bisa diedit/dihapus) |

---

## 10. Non-Functional Requirements

| Aspek | Requirement |
|---|---|
| **SEO & Social Share Preview** | Metadata per halaman, `sitemap.xml`, `robots.txt`, URL slug ramah SEO. **Setiap link yang dibagikan ke media sosial (WhatsApp, Instagram, Facebook, X, Telegram) menampilkan banner preview**: gambar, judul, dan deskripsi via Open Graph + Twitter Card meta tags. Berita memakai thumbnail + judul + excerpt; form dinamis memakai banner + judul + deskripsi; halaman lain memakai gambar OG default organisasi (dapat diganti dari CMS). Halaman detail tanpa gambar memakai **OG image dinamis** (`next/og`) bertema merah/biru dengan logo & judul |
| **Multibahasa** | Seluruh halaman publik tersedia dalam ID & EN (`next-intl`), tag `hreflang` antar-locale, fallback konten EN → ID (lihat §4.10) |
| **Performa** | **Lighthouse hijau (≥ 90) di keempat kategori** — strategi lengkap di §10.1 |
| **Keamanan** | RLS di semua tabel; validasi zod di client & server; middleware proteksi `/dashboard/**` (role `public` ditolak); sanitasi konten rich text & komentar; rate limit form publik & komentar; **filter kata kasar sederhana (blocklist) pada komentar**; batasan tipe & ukuran semua upload; audit log append-only |
| **Aksesibilitas** | Kontras warna memadai di kedua tema, navigasi keyboard, alt text gambar (detail di §10.1) |
| **Responsivitas** | Layak pakai penuh di mobile, tablet, desktop |
| **Maintainability** | TypeScript strict, arsitektur modul berprinsip microfrontend (§2.2), seluruh konten dari database (tanpa hardcode) |

### 10.1 Strategi Lighthouse Hijau (semua kategori ≥ 90)

Target: **Performance, Accessibility, Best Practices, dan SEO hijau (≥ 90)** pada halaman publik utama (Beranda, Berita list & detail, Form), diuji mobile & desktop.

**Performance:**

- **Server Components by default** — komponen client (`"use client"`) hanya untuk bagian interaktif; JS dikirim seminimal mungkin.
- ISR/SSG untuk semua halaman publik + `revalidatePath` saat konten berubah — tidak ada fetch blocking di client.
- Gambar: `next/image` (AVIF/WebP otomatis, `sizes` responsif), dimensi eksplisit (anti-CLS), `priority` hanya untuk gambar LCP (hero), sisanya lazy; kompresi & resize saat upload ke Supabase Storage.
- Font: `next/font` (self-hosted, `display: swap`, subset) — tanpa request font eksternal.
- Code splitting per modul (§2.2): `dynamic()` untuk Tiptap, form builder, lightbox, chart; halaman publik tidak membawa JS dashboard.
- Framer Motion diimpor selektif (`LazyMotion` + `domAnimation`) agar bundle animasi kecil; animasi berbasis transform/opacity (GPU, anti-layout-shift).
- Hindari layout shift: skeleton berdimensi tetap, ruang dicadangkan untuk konten dinamis (embed maps di-lazy-load dengan placeholder berukuran sama).
- Third-party minimal: tanpa script analitik berat; embed Google Maps dimuat saat mendekati viewport (facade pattern).
- Budget Core Web Vitals: **LCP < 2.5s, CLS < 0.1, INP < 200ms** (data lapangan via Vercel Speed Insights).

**Accessibility:**

- HTML semantik (landmark `header/nav/main/footer`, heading berurutan, satu `h1` per halaman).
- Kontras teks ≥ 4.5:1 di kedua tema (token merah/biru diuji kontras saat setup design system).
- Semua elemen interaktif dapat dijangkau keyboard dengan focus ring terlihat; komponen shadcn/Radix sudah menyediakan ARIA & focus management.
- `alt` deskriptif wajib untuk semua gambar konten (field alt di form upload dashboard); ikon dekoratif `aria-hidden`.
- Label eksplisit pada semua input form; error form diumumkan via `aria-describedby`.
- `lang` dokumen mengikuti locale aktif (`id`/`en`).

**Best Practices:**

- HTTPS (Vercel), tanpa error console, tanpa API deprecated.
- Aspect ratio gambar konsisten, tidak ada gambar terdistorsi.
- Header keamanan: CSP dasar, `X-Content-Type-Options`, `Referrer-Policy` (via `next.config` headers).
- Dependensi dipindai (`npm audit`) sebelum rilis.

**SEO:** sudah dirinci di tabel §10 (metadata, OG, sitemap, hreflang, slug).

**Penegakan berkelanjutan:** **Lighthouse CI** berjalan di setiap Vercel preview deployment dengan assertion ≥ 90 untuk keempat kategori — regresi skor menggagalkan check sebelum merge.

---

## 11. Fase Pengembangan

| Fase | Lingkup | Hasil |
|---|---|---|
| **1. Fondasi** | Setup Next.js + Tailwind + shadcn/ui + Framer Motion, struktur modul microfrontend + aturan ESLint boundaries (§2.2), tema merah/biru + dark/light mode, setup `next-intl` (routing ID/EN), setup Supabase (schema, RLS, storage, seed), layout navbar/footer, **Lighthouse CI di pipeline** | Kerangka proyek berjalan dwibahasa dengan guard kualitas aktif |
| **2. Halaman Publik** | Beranda, Tentang, Struktur (kepengurusan & departemen), Berita (list/detail/filter/search), Galeri, Agenda (+ jenis Proker), Kontak, Pendaftaran | Seluruh halaman publik tampil dengan data dari DB |
| **3. Auth & Dashboard Dasar** | Login internal, Google OAuth user publik, middleware role, layout sidebar dashboard, overview, pengaturan profil | Empat role terbentuk; tiga role internal bisa masuk dashboard, user publik tertolak |
| **4. Modul Berita & Approval** | CRUD berita + editor Tiptap + upload gambar, alur approval panitia, manajemen kategori, **komentar berita (Google login) + threaded reply + reaksi emoji + moderasi** | Workflow berita & komentar lengkap |
| **5. Manajemen Akun & CMS** | Manajemen akun (Super Admin & Admin), editor konten semua halaman (CMS, tab ID/EN), kelola struktur/departemen | Super Admin mengubah website tanpa kode |
| **6. Form Dinamis** | Form builder, halaman publik `/form/[slug]` (login Google), deadline & extend, tampil/sembunyi otomatis di beranda, rekap respons + ekspor Excel/CSV, share link | Modul form lengkap |
| **7. Modul Pelengkap** | Galeri, agenda, pendaftar (+ ekspor Excel/CSV), pesan kontak | Semua fitur v1 lengkap |
| **8. Polish & Rilis** | SEO + OG banner semua halaman (uji preview WhatsApp/medsos), audit **Lighthouse hijau semua kategori** (§10.1), pengujian alur per role & per bahasa, seed data asli, deploy Vercel + domain | Website live |

---

## 12. Out of Scope (v1)

Fitur berikut **tidak** termasuk versi pertama (dapat menjadi roadmap v2):

- Database/direktori alumni.
- Notifikasi email/push (mis. saat berita di-approve, ada respons form baru, atau komentar dibalas).
- Penjadwalan publish berita (scheduled publish).
- Bahasa ketiga selain ID/EN.
- Pembayaran/iuran anggota online.
- Mobile app.
- 2FA untuk akun internal.

---

## 13. Kriteria Keberhasilan (Acceptance Criteria)

1. Publik dapat mengakses semua halaman (Beranda, Tentang, Struktur, Berita, Galeri, Agenda, Pendaftaran, Kontak) di mobile & desktop, dalam dark maupun light mode.
2. Dropdown "Struktur Organisasi" di navbar menampilkan dua submenu: Struktur Kepengurusan dan Departemen.
3. Berita dapat difilter per kategori (Proker, Non-Proker, Alumni, dst.) dan dicari.
4. Panitia yang mengunggah berita tidak dapat mempublikasikannya langsung — berita tampil di publik hanya setelah di-approve Admin/Super Admin.
5. Admin dapat membuat dan mengelola akun Panitia; Super Admin dapat mengelola semua akun.
6. Super Admin dapat mengubah teks/gambar Beranda, Tentang, dan Kontak dari dashboard, dan perubahan langsung tampil di halaman publik tanpa deploy ulang.
7. Form pendaftaran anggota dan form kontak tersimpan ke database dan terbaca di dashboard.
8. Pengguna dengan role lebih rendah tidak dapat mengakses menu/aksi role di atasnya (ditegakkan di UI, server, dan RLS).
9. Super Admin/Admin dapat membuat form dinamis, membagikan linknya, dan mengunduh seluruh respons sebagai Excel/CSV; form tampil di beranda selama deadline berlaku, otomatis tersembunyi setelah lewat, dan muncul kembali saat deadline di-extend.
10. User publik dapat login dengan Google untuk berkomentar di berita dan mengisi form, tetapi **tidak dapat** mengakses dashboard; tanpa login Google, komentar dan pengisian form tidak bisa dilakukan.
    - Komentar dapat **dibalas** (thread 1 level, balasan tampil menjorok di bawah induknya) dan diberi **reaksi emoji** (satu reaksi per user per komentar, bisa diganti/dibatalkan, jumlah per emoji tampil).
    - Menyembunyikan/menghapus komentar induk turut menyembunyikan balasannya; moderasi berlaku untuk komentar maupun balasan.
11. Agenda menampilkan jenis Proker/Non-Proker dan dapat difilter; agenda proker terhubung ke program kerja departemen.
12. Seluruh halaman publik dapat dibuka dalam Bahasa Indonesia dan English via switcher bahasa, dengan fallback ke ID untuk konten yang belum diterjemahkan.
13. Link halaman mana pun (beranda, berita, form) yang dibagikan ke WhatsApp/media sosial menampilkan banner preview berisi gambar, judul, dan deskripsi yang sesuai.
14. Skor Lighthouse **hijau (≥ 90) di keempat kategori** (Performance, Accessibility, Best Practices, SEO) pada Beranda, Berita (list & detail), dan halaman Form — mobile & desktop — dan dijaga otomatis oleh Lighthouse CI di setiap preview deployment.
15. Batas antar modul fitur ditegakkan lint (tidak ada impor lintas-internal modul); fitur baru dapat ditambahkan sebagai modul baru tanpa mengubah modul lain.
16. Halaman Kebijakan Privasi tersedia (link di footer, konten dari CMS), dan form pendaftaran maupun form dinamis menampilkan checkbox persetujuan pengolahan data sebelum submit.
17. Mengedit judul berita yang sudah published tidak mengubah slug/URL-nya; aksi penting (publish, approve, hapus, perubahan akun/CMS) tercatat di Log Aktivitas dan terbaca oleh Super Admin.

---

## 14. Operasional & Keberlanjutan

Hal di luar kode yang menentukan website tetap hidup antar periode kepengurusan:

### 14.1 Mitigasi Batasan Free Tier

| Risiko | Mitigasi |
|---|---|
| Supabase free tier **men-pause project setelah ±1 minggu tanpa aktivitas** | **Vercel Cron Job harian** menjalankan query ringan ke database (keep-alive) |
| SMTP bawaan Supabase dibatasi ±2–4 email/jam | Custom SMTP via **Resend** (free 100 email/hari), sender dari domain organisasi |
| Storage 1GB cepat penuh oleh foto kegiatan | Kompresi & resize **wajib** saat upload (target ≤ 300KB per foto galeri); batas ukuran di semua input upload; pantau pemakaian per bulan |
| Vercel Hobby: limit image optimization & bandwidth | Gambar sudah dikompresi sebelum masuk storage; cache ISR mengurangi fungsi yang berjalan |

### 14.2 Kepemilikan Akun & Handover

- **Semua akun layanan (GitHub, Vercel, Supabase, Google Cloud/OAuth, domain, Resend, Sentry) dimiliki email resmi organisasi** (mis. `kmpunhas@gmail.com` atau email domain) — **bukan email pribadi ketua** — agar pergantian pengurus tidak memutus akses.
- Kredensial disimpan di password manager organisasi; serah terima akses menjadi bagian resmi prosedur pergantian kepengurusan, bersamaan dengan pemindahan role Super Admin di aplikasi.
- Dokumentasi singkat untuk admin non-teknis (cara kelola berita, form, CMS) disertakan saat rilis.

### 14.3 Backup & Pemulihan

- **Backup mingguan otomatis**: GitHub Actions menjalankan `pg_dump` database Supabase, hasilnya disimpan sebagai artifact/Google Drive organisasi (free tier Supabase tidak punya point-in-time recovery).
- File storage di-backup bulanan (sinkron bucket ke Drive) atau minimal sebelum pergantian periode.
- Uji restore dilakukan sekali sebelum rilis.

### 14.4 Konten & Bahasa

- Penanggung jawab **input konten awal** (sejarah, struktur, departemen, berita lama, foto) ditunjuk sebelum Fase 8 — website tidak dirilis kosong.
- Penanggung jawab **terjemahan EN** ditunjuk (mis. departemen kominfo); jika tidak tersedia, konten EN dibiarkan fallback ke ID — bukan blocker rilis.

### 14.5 Monitoring Setelah Rilis

- **Sentry** (free tier) untuk error tracking aplikasi.
- **Vercel Analytics & Speed Insights** untuk data pengunjung dan Core Web Vitals lapangan.
- Pemeriksaan bulanan ringan oleh pengurus: kuota Supabase/Vercel, hasil backup, dan error Sentry.
