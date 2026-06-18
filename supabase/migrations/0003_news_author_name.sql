-- Nama penulis kustom untuk berita (mis. kredit penulis asli yang berbeda
-- dari akun yang mempublikasikan). Kosong → fallback ke nama profil akun.
alter table news add column if not exists author_name text;
