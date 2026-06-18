-- Bootstrap akun Super Admin pertama untuk KMP-UNHAS.
--
-- PRASYARAT:
--   1. Skema sudah dijalankan: supabase/migrations/0001_init.sql (lalu 0002_seed.sql).
--   2. User sudah dibuat lewat Supabase Dashboard → Authentication → Users → Add user
--      (isi email + password, centang "Auto Confirm User").
--
-- GANTI email & nama di bawah, lalu jalankan di Supabase SQL Editor.
-- Memakai UPSERT: berfungsi baik jika baris profil sudah ada (dibuat trigger)
-- maupun belum ada (mis. user dibuat sebelum skema dijalankan).

insert into public.profiles (id, full_name, role, is_active)
select u.id, 'Nama Ketua', 'super_admin', true
from auth.users u
where u.email = 'email-anda@contoh.com'
on conflict (id) do update
  set role = 'super_admin',
      full_name = excluded.full_name,
      is_active = true;

-- Verifikasi (harus mengembalikan 1 baris dengan role super_admin):
select p.full_name, p.role, p.is_active, u.email
from public.profiles p
join auth.users u on u.id = p.id
where u.email = 'email-anda@contoh.com';
