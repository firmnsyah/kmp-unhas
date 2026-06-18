-- Kategori baru untuk pengurus inti (Badan Pengurus Harian) periode SAAT INI:
-- Ketua Umum, Wakil, Sekretaris, Bendahara, dll. Dipakai bagan Struktur
-- Kepengurusan. 'pimpinan' tetap = daftar pengurus terdahulu per periode.
alter type org_category add value if not exists 'pengurus_inti';
