-- KMP-UNHAS — Skema awal (PRD v1.5 §9)
-- Konvensi multibahasa: kolom konten yang diterjemahkan bertipe JSONB {"id": "...", "en": "..."}
-- (fallback ke "id" dilakukan di aplikasi).

-- ========== ENUMS ==========
create type user_role as enum ('super_admin', 'admin', 'panitia', 'public');
create type news_status as enum ('draft', 'pending', 'published', 'rejected');
create type event_type as enum ('proker', 'non_proker');
create type event_status as enum ('upcoming', 'done');
create type question_type as enum ('short_text', 'long_text', 'number', 'email', 'phone', 'radio', 'checkbox', 'dropdown', 'date', 'file');
create type reaction_emoji as enum ('like', 'love', 'haha', 'wow', 'sad');
create type registration_status as enum ('baru', 'dihubungi', 'diterima', 'ditolak');
create type org_category as enum ('pimpinan', 'dewan_pembina', 'dewan_pertimbangan');

-- ========== TABEL ==========
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role user_role not null default 'public',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table news_categories (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null, -- {"id","en"}
  slug text not null unique
);

create table news (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  slug text not null unique, -- permanen setelah published (PRD §7)
  excerpt jsonb,
  content jsonb not null, -- rich text HTML per locale
  thumbnail_url text,
  category_id uuid references news_categories (id) on delete set null,
  author_id uuid references profiles (id) on delete set null,
  status news_status not null default 'draft',
  review_note text,
  reviewed_by uuid references profiles (id) on delete set null,
  published_at timestamptz,
  deleted_at timestamptz, -- soft delete
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_status_idx on news (status, published_at desc) where deleted_at is null;

create table departments (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null,
  slug text not null unique,
  description jsonb,
  image_url text,
  sort_order int not null default 0
);

create table department_members (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references departments (id) on delete cascade,
  name text not null,
  position jsonb not null, -- {"id": "Kepala Departemen", "en": "Head of Department"}
  photo_url text,
  batch text, -- angkatan
  sort_order int not null default 0
);

create table department_programs (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references departments (id) on delete cascade,
  name jsonb not null,
  description jsonb
);

create table org_structure (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position jsonb not null,
  photo_url text,
  batch text,
  period text not null, -- mis. "2025/2026"
  category org_category not null default 'pimpinan', -- pimpinan / dewan pembina / dewan pertimbangan
  sort_order int not null default 0
);

create table site_content (
  key text primary key, -- home_hero, home_stats, chairman, about, contact, settings, privacy
  value jsonb not null,
  updated_by uuid references profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  slug text not null unique,
  description jsonb,
  cover_url text,
  event_date date
);

create table gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references gallery_albums (id) on delete cascade,
  image_url text not null,
  caption jsonb,
  sort_order int not null default 0
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  description jsonb,
  location text,
  start_at timestamptz not null,
  end_at timestamptz,
  image_url text,
  type event_type not null default 'non_proker',
  department_id uuid references departments (id) on delete set null,
  program_id uuid references department_programs (id) on delete set null,
  status event_status not null default 'upcoming'
);

create table forms (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  slug text not null unique,
  description jsonb,
  banner_url text,
  deadline_at timestamptz not null,
  is_active boolean not null default true,
  show_on_home boolean not null default true,
  one_response_per_user boolean not null default true,
  allow_edit_response boolean not null default false,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table form_questions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms (id) on delete cascade,
  label jsonb not null,
  type question_type not null,
  options jsonb, -- untuk radio/checkbox/dropdown
  is_required boolean not null default false,
  sort_order int not null default 0
);

create table form_responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  answers jsonb not null, -- {question_id: jawaban}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index form_responses_form_idx on form_responses (form_id, user_id);

create table news_comments (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references news (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  parent_id uuid references news_comments (id) on delete cascade, -- thread 1 level
  reply_to_user_id uuid references profiles (id) on delete set null, -- mention @nama
  content text not null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_comments_news_idx on news_comments (news_id, created_at);

create table comment_reactions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references news_comments (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  emoji reaction_emoji not null,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id) -- satu reaksi per user per komentar
);

create table registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  nim text not null,
  faculty text not null,
  major text not null,
  batch text not null,
  origin text not null, -- kecamatan/sekolah asal di Pinrang
  email text not null,
  whatsapp text not null,
  reason text not null,
  consent boolean not null default false,
  status registration_status not null default 'baru',
  created_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- ========== TRIGGERS ==========
-- Profil otomatis saat user baru (Google OAuth => role 'public';
-- akun internal dibuat via service role dengan metadata role).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'public')
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger news_updated_at before update on news for each row execute function public.set_updated_at();
create trigger comments_updated_at before update on news_comments for each row execute function public.set_updated_at();
create trigger responses_updated_at before update on form_responses for each row execute function public.set_updated_at();

-- Helper role pengguna saat ini (dipakai kebijakan RLS).
create or replace function public.current_user_role()
returns user_role language sql security definer stable set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ========== RLS (PRD §9.3) ==========
alter table profiles enable row level security;
alter table news_categories enable row level security;
alter table news enable row level security;
alter table departments enable row level security;
alter table department_members enable row level security;
alter table department_programs enable row level security;
alter table org_structure enable row level security;
alter table site_content enable row level security;
alter table gallery_albums enable row level security;
alter table gallery_photos enable row level security;
alter table events enable row level security;
alter table forms enable row level security;
alter table form_questions enable row level security;
alter table form_responses enable row level security;
alter table news_comments enable row level security;
alter table comment_reactions enable row level security;
alter table registrations enable row level security;
alter table contact_messages enable row level security;
alter table activity_logs enable row level security;

-- profiles
create policy "read own profile" on profiles for select using (id = auth.uid());
create policy "admin read profiles" on profiles for select using (current_user_role() in ('super_admin', 'admin'));
create policy "super admin manage profiles" on profiles for all using (current_user_role() = 'super_admin');
create policy "admin manage panitia" on profiles for update using (current_user_role() = 'admin' and role = 'panitia');

-- news
create policy "public read published news" on news for select
  using (status = 'published' and deleted_at is null);
create policy "author read own news" on news for select using (author_id = auth.uid());
create policy "admin read all news" on news for select using (current_user_role() in ('super_admin', 'admin'));
create policy "panitia insert own news" on news for insert
  with check (author_id = auth.uid() and current_user_role() in ('panitia', 'admin', 'super_admin') and status in ('draft', 'pending'));
create policy "panitia update own news" on news for update
  using (author_id = auth.uid() and current_user_role() = 'panitia')
  with check (status in ('draft', 'pending'));
create policy "admin manage news" on news for all using (current_user_role() in ('super_admin', 'admin'));

-- konten publik read-only
create policy "public read categories" on news_categories for select using (true);
create policy "admin manage categories" on news_categories for all using (current_user_role() in ('super_admin', 'admin'));

create policy "public read departments" on departments for select using (true);
create policy "public read department members" on department_members for select using (true);
create policy "public read department programs" on department_programs for select using (true);
create policy "public read org structure" on org_structure for select using (true);
create policy "public read site content" on site_content for select using (true);
create policy "super admin manage departments" on departments for all using (current_user_role() = 'super_admin');
create policy "super admin manage department members" on department_members for all using (current_user_role() = 'super_admin');
create policy "super admin manage department programs" on department_programs for all using (current_user_role() = 'super_admin');
create policy "super admin manage org structure" on org_structure for all using (current_user_role() = 'super_admin');
create policy "super admin manage site content" on site_content for all using (current_user_role() = 'super_admin');

create policy "public read albums" on gallery_albums for select using (true);
create policy "public read photos" on gallery_photos for select using (true);
create policy "admin manage albums" on gallery_albums for all using (current_user_role() in ('super_admin', 'admin'));
create policy "admin manage photos" on gallery_photos for all using (current_user_role() in ('super_admin', 'admin'));

create policy "public read events" on events for select using (true);
create policy "admin manage events" on events for all using (current_user_role() in ('super_admin', 'admin'));

-- forms: publik hanya melihat form aktif yang belum lewat deadline
create policy "public read active forms" on forms for select
  using ((is_active and deadline_at > now()) or current_user_role() in ('super_admin', 'admin'));
create policy "admin insert forms" on forms for insert
  with check (current_user_role() in ('super_admin', 'admin') and created_by = auth.uid());
create policy "owner update forms" on forms for update
  using (current_user_role() = 'super_admin' or (current_user_role() = 'admin' and created_by = auth.uid()));
create policy "owner delete forms" on forms for delete
  using (current_user_role() = 'super_admin' or (current_user_role() = 'admin' and created_by = auth.uid()));

create policy "public read questions of visible forms" on form_questions for select
  using (exists (select 1 from forms f where f.id = form_id and ((f.is_active and f.deadline_at > now()) or current_user_role() in ('super_admin', 'admin'))));
create policy "admin manage questions" on form_questions for all using (current_user_role() in ('super_admin', 'admin'));

create policy "user read own responses" on form_responses for select
  using (user_id = auth.uid() or current_user_role() in ('super_admin', 'admin'));
create policy "user submit response" on form_responses for insert
  with check (user_id = auth.uid() and exists (select 1 from forms f where f.id = form_id and f.is_active and f.deadline_at > now()));
create policy "user edit own response" on form_responses for update
  using (user_id = auth.uid())
  with check (exists (select 1 from forms f where f.id = form_id and f.is_active and f.deadline_at > now() and f.allow_edit_response));

-- komentar & reaksi
create policy "public read visible comments" on news_comments for select
  using (is_hidden = false or current_user_role() in ('super_admin', 'admin'));
create policy "user write own comment" on news_comments for insert
  with check (user_id = auth.uid());
create policy "user update own comment" on news_comments for update using (user_id = auth.uid());
create policy "user delete own comment" on news_comments for delete using (user_id = auth.uid());
create policy "admin moderate comments" on news_comments for all using (current_user_role() in ('super_admin', 'admin'));

create policy "public read reactions" on comment_reactions for select using (true);
create policy "user manage own reaction" on comment_reactions for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- form publik (anonim boleh insert, hanya admin yang baca)
create policy "anyone submit registration" on registrations for insert with check (true);
create policy "admin read registrations" on registrations for select using (current_user_role() in ('super_admin', 'admin'));
create policy "admin update registrations" on registrations for update using (current_user_role() in ('super_admin', 'admin'));

create policy "anyone send message" on contact_messages for insert with check (true);
create policy "admin read messages" on contact_messages for select using (current_user_role() in ('super_admin', 'admin'));
create policy "admin update messages" on contact_messages for update using (current_user_role() in ('super_admin', 'admin'));

-- audit log: append-only, hanya super admin yang membaca
create policy "super admin read logs" on activity_logs for select using (current_user_role() = 'super_admin');
create policy "authenticated insert logs" on activity_logs for insert with check (auth.uid() is not null);

-- ========== STORAGE BUCKETS ==========
insert into storage.buckets (id, name, public) values
  ('news', 'news', true),
  ('gallery', 'gallery', true),
  ('people', 'people', true),
  ('site', 'site', true),
  ('forms', 'forms', true)
on conflict (id) do nothing;

create policy "public read storage" on storage.objects for select using (bucket_id in ('news', 'gallery', 'people', 'site', 'forms'));
create policy "staff upload storage" on storage.objects for insert
  with check (bucket_id in ('news', 'gallery', 'people', 'site', 'forms') and current_user_role() in ('super_admin', 'admin', 'panitia'));
create policy "staff manage storage" on storage.objects for update
  using (current_user_role() in ('super_admin', 'admin'));
create policy "staff delete storage" on storage.objects for delete
  using (current_user_role() in ('super_admin', 'admin'));
