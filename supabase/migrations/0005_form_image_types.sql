-- Tipe pertanyaan form untuk unggah gambar (1 foto / banyak foto).
-- 'file' sudah ada sejak 0001. ADD VALUE tak bisa dalam transaksi → jalankan terpisah.
alter type question_type add value if not exists 'image_single';
alter type question_type add value if not exists 'image_multiple';
