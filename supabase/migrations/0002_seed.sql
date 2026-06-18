-- KMP-UNHAS — Seed data awal (konten demo; ganti lewat dashboard/CMS setelah Fase 3+)
-- Gambar memakai placeholder lokal aplikasi web (/images/*.svg).

-- Kategori berita
insert into news_categories (name, slug) values
  ('{"id": "Proker", "en": "Work Program"}', 'proker'),
  ('{"id": "Non-Proker", "en": "Non-Program"}', 'non-proker'),
  ('{"id": "Alumni", "en": "Alumni"}', 'alumni'),
  ('{"id": "Pengumuman", "en": "Announcement"}', 'pengumuman');

-- Konten halaman (CMS)
insert into site_content (key, value) values
('settings', '{
  "site_name": "KMP-UNHAS",
  "registration_open": true,
  "footer_text": {"id": "Kerukunan Mahasiswa Pinrang Universitas Hasanuddin", "en": "Pinrang Students Association of Hasanuddin University"}
}'),
('home_hero', '{
  "title": {"id": "Kerukunan Mahasiswa Pinrang", "en": "Pinrang Students Association"},
  "subtitle": {"id": "Universitas Hasanuddin", "en": "Hasanuddin University"},
  "description": {"id": "Wadah silaturahmi, pengembangan diri, dan pengabdian mahasiswa asal Kabupaten Pinrang yang menempuh pendidikan di Universitas Hasanuddin.", "en": "A home for connection, self-development, and community service for students from Pinrang Regency studying at Hasanuddin University."},
  "images": ["/images/hero1.webp", "/images/hero2.webp", "/images/hero3.jpg"]
}'),
('home_stats', '{
  "founded": 1990,
  "members": 250,
  "departments": 5,
  "programs": 24
}'),
('chairman', '{
  "name": "Muh. Fajri Ramadhan",
  "period": "2025/2026",
  "photo_url": "/images/avatar-placeholder.svg",
  "quote": {"id": "KMP-UNHAS adalah rumah kedua bagi mahasiswa Pinrang di Makassar. Mari tumbuh, berkarya, dan mengabdi bersama untuk kampung halaman.", "en": "KMP-UNHAS is a second home for Pinrang students in Makassar. Let us grow, create, and serve our hometown together."}
}'),
('about', '{
  "history": {"id": "<p>KMP-UNHAS (Kerukunan Mahasiswa Pinrang Universitas Hasanuddin) berdiri sebagai wadah persaudaraan mahasiswa asal Kabupaten Pinrang yang menempuh pendidikan di Universitas Hasanuddin. Sejak didirikan, organisasi ini aktif membina anggota melalui kaderisasi, kegiatan sosial, dan program pengabdian ke kampung halaman.</p>", "en": "<p>KMP-UNHAS (Pinrang Students Association of Hasanuddin University) was founded as a brotherhood for students from Pinrang Regency studying at Hasanuddin University. Since its founding, the organization has nurtured its members through cadre development, social activities, and hometown service programs.</p>"},
  "vision": {"id": "Menjadi organisasi kedaerahan yang solid, profesional, dan bermanfaat bagi anggota serta masyarakat Pinrang.", "en": "To be a solid, professional regional organization that benefits its members and the people of Pinrang."},
  "missions": {"id": ["Mempererat silaturahmi antar mahasiswa Pinrang di UNHAS", "Mengembangkan potensi akademik, minat, dan bakat anggota", "Berkontribusi nyata bagi pembangunan Kabupaten Pinrang", "Menjalin kemitraan dengan pemerintah daerah dan alumni"], "en": ["Strengthen the bonds among Pinrang students at UNHAS", "Develop members'' academic potential, interests, and talents", "Contribute tangibly to the development of Pinrang Regency", "Build partnerships with the local government and alumni"]},
  "purpose": {"id": ["Menghimpun dan mempersatukan mahasiswa asal Kabupaten Pinrang di Universitas Hasanuddin", "Membentuk anggota yang berintegritas, berprestasi, dan berjiwa kepemimpinan", "Menjadi penghubung antara mahasiswa Pinrang dengan masyarakat dan pemerintah daerah"], "en": ["Gather and unite students from Pinrang Regency at Hasanuddin University", "Shape members with integrity, achievement, and leadership spirit", "Bridge Pinrang students with the community and local government"]},
  "efforts": {"id": ["Menyelenggarakan kaderisasi dan pelatihan pengembangan diri", "Mengadakan kegiatan sosial, keagamaan, serta minat dan bakat", "Menjalin kerja sama dengan alumni, kampus, dan pemerintah daerah", "Mengelola kanal informasi dan dokumentasi organisasi"], "en": ["Conduct cadre development and self-improvement training", "Hold social, religious, and talent-based activities", "Build cooperation with alumni, campus, and local government", "Manage the organization''s information and documentation channels"]},
  "logo_philosophy": {"id": "Warna merah melambangkan keberanian dan semangat juang, biru melambangkan keluasan ilmu dan kedalaman persaudaraan.", "en": "Red symbolizes courage and fighting spirit; blue symbolizes the breadth of knowledge and the depth of brotherhood."},
  "logo_download_url": "/images/logo.png",
  "logo_creator": {"name": "Tim Kominfo KMP-UNHAS", "photo_url": "/images/avatar-placeholder.svg", "description": {"id": "Logo resmi KMP-UNHAS dirancang oleh tim kreatif organisasi sebagai identitas kebanggaan bersama. (Keterangan ini contoh — silakan perbarui melalui dashboard.)", "en": "The official KMP-UNHAS logo was designed by the organization''s creative team as a shared identity. (This description is a placeholder — please update it via the dashboard.)"}}
}'),
('contact', '{
  "address": "Sekretariat KMP-UNHAS, Jl. Perintis Kemerdekaan KM 10, Tamalanrea, Makassar",
  "email": "kmpunhas@gmail.com",
  "phone": "+62 821-0000-0000",
  "instagram": "https://instagram.com/kmp_unhas",
  "youtube": "",
  "tiktok": "",
  "maps_embed": "https://www.google.com/maps?q=-5.1343974,119.4805851&z=17&output=embed"
}'),
('privacy', '{
  "content": {"id": "<h2>Kebijakan Privasi</h2><p>KMP-UNHAS menghormati privasi Anda. Data pribadi yang dikumpulkan melalui form pendaftaran dan form kegiatan (nama, NIM, kontak) hanya digunakan untuk keperluan administrasi organisasi dan tidak dibagikan kepada pihak ketiga.</p><p>Login Google hanya digunakan untuk identitas komentar dan pengisian form. Anda dapat meminta penghapusan data dengan menghubungi pengurus.</p>", "en": "<h2>Privacy Policy</h2><p>KMP-UNHAS respects your privacy. Personal data collected through registration and activity forms (name, student ID, contact) is used solely for organizational administration and is never shared with third parties.</p><p>Google sign-in is used only for comment identity and form submissions. You may request data deletion by contacting the board.</p>"}
}'),
('mars', '{
  "lyrics": {"id": "Kerukunan Mahasiswa Pinrang\nBersatu padu dalam satu tekad\nMenuntut ilmu di Hasanuddin\nMengabdi tulus untuk negeri\n\nDari Pinrang kami berasal\nMembawa cita menggapai asa\nJunjung tinggi nama almamater\nKMP-UNHAS jaya selalu\n\n(Lirik mars ini masih contoh — silakan ganti dengan lirik resmi melalui dashboard.)", "en": "Pinrang Students Association\nUnited in one resolve\nSeeking knowledge at Hasanuddin\nServing sincerely for the nation\n\nFrom Pinrang we come\nCarrying dreams to reach our hopes\nUpholding the name of our alma mater\nKMP-UNHAS, forever glorious\n\n(These anthem lyrics are a placeholder — please replace them with the official lyrics via the dashboard.)"},
  "video_url": "https://www.youtube.com/watch?v=y_Y_VhOUqnQ"
}');

-- Departemen
insert into departments (name, slug, description, image_url, sort_order) values
('{"id": "Pengembangan Sumber Daya Manusia", "en": "Human Resource Development"}', 'psdm',
 '{"id": "Kaderisasi dan pengembangan kapasitas anggota melalui pelatihan dan mentoring.", "en": "Cadre building and member capacity development through training and mentoring."}',
 '/images/dept-placeholder.svg', 1),
('{"id": "Komunikasi dan Informasi", "en": "Communication and Information"}', 'kominfo',
 '{"id": "Publikasi, dokumentasi, dan pengelolaan media sosial serta website organisasi.", "en": "Publication, documentation, and management of the organization''s social media and website."}',
 '/images/dept-placeholder.svg', 2),
('{"id": "Keagamaan", "en": "Religious Affairs"}', 'keagamaan',
 '{"id": "Pembinaan kerohanian dan kegiatan keagamaan anggota.", "en": "Spiritual development and religious activities for members."}',
 '/images/dept-placeholder.svg', 3),
('{"id": "Minat dan Bakat", "en": "Talent and Interest"}', 'minat-bakat',
 '{"id": "Pengembangan minat olahraga, seni, dan kreativitas anggota.", "en": "Developing members'' interests in sports, arts, and creativity."}',
 '/images/dept-placeholder.svg', 4),
('{"id": "Dana dan Usaha", "en": "Funding and Enterprise"}', 'danus',
 '{"id": "Penggalangan dana dan pengembangan unit usaha organisasi.", "en": "Fundraising and development of the organization''s business units."}',
 '/images/dept-placeholder.svg', 5);

-- Pimpinan organisasi (pengurus inti)
insert into org_structure (name, position, photo_url, batch, period, category, sort_order) values
('Mustaqim Akbar', '{"id": "Ketua Umum", "en": "Chairperson"}', '/images/avatar-placeholder.svg', '2022', '2025/2026', 'pimpinan', 1),
('Andi Tenri Abeng', '{"id": "Wakil Ketua", "en": "Vice Chairperson"}', '/images/avatar-placeholder.svg', '2022', '2025/2026', 'pimpinan', 2),
('Nurul Izzah', '{"id": "Sekretaris Umum", "en": "General Secretary"}', '/images/avatar-placeholder.svg', '2023', '2025/2026', 'pimpinan', 3),
('Ahmad Dzaki', '{"id": "Wakil Sekretaris", "en": "Deputy Secretary"}', '/images/avatar-placeholder.svg', '2023', '2025/2026', 'pimpinan', 4),
('Sitti Rahmadani', '{"id": "Bendahara Umum", "en": "General Treasurer"}', '/images/avatar-placeholder.svg', '2022', '2025/2026', 'pimpinan', 5),
('Reski Amalia', '{"id": "Wakil Bendahara", "en": "Deputy Treasurer"}', '/images/avatar-placeholder.svg', '2023', '2025/2026', 'pimpinan', 6);

-- Dewan Pembina Organisasi
insert into org_structure (name, position, photo_url, batch, period, category, sort_order) values
('Prof. Dr. H. Andi Pattola', '{"id": "Pembina", "en": "Patron"}', '/images/avatar-placeholder.svg', '1998', '2025/2026', 'dewan_pembina', 1),
('Dr. Hj. Sitti Nurhayati', '{"id": "Pembina", "en": "Patron"}', '/images/avatar-placeholder.svg', '2001', '2025/2026', 'dewan_pembina', 2);

-- Dewan Pertimbangan Organisasi
insert into org_structure (name, position, photo_url, batch, period, category, sort_order) values
('Muh. Yusuf Tahir', '{"id": "Ketua Dewan Pertimbangan", "en": "Council Chair"}', '/images/avatar-placeholder.svg', '2018', '2025/2026', 'dewan_pertimbangan', 1),
('A. Nurul Fadhilah', '{"id": "Anggota", "en": "Member"}', '/images/avatar-placeholder.svg', '2019', '2025/2026', 'dewan_pertimbangan', 2),
('Rahmat Hidayat', '{"id": "Anggota", "en": "Member"}', '/images/avatar-placeholder.svg', '2019', '2025/2026', 'dewan_pertimbangan', 3);

-- Anggota & proker departemen (contoh: PSDM dan Kominfo)
insert into department_members (department_id, name, position, photo_url, batch, sort_order)
select id, 'Muh. Alif Hidayat', '{"id": "Kepala Departemen", "en": "Head of Department"}', '/images/avatar-placeholder.svg', '2022', 1 from departments where slug = 'psdm';
insert into department_members (department_id, name, position, photo_url, batch, sort_order)
select id, 'Fitri Handayani', '{"id": "Sekretaris Departemen", "en": "Department Secretary"}', '/images/avatar-placeholder.svg', '2023', 2 from departments where slug = 'psdm';
insert into department_members (department_id, name, position, photo_url, batch, sort_order)
select id, 'A. Muh. Farhan', '{"id": "Kepala Departemen", "en": "Head of Department"}', '/images/avatar-placeholder.svg', '2022', 1 from departments where slug = 'kominfo';

insert into department_programs (department_id, name, description)
select id, '{"id": "Latihan Kepemimpinan Dasar", "en": "Basic Leadership Training"}',
  '{"id": "Pelatihan kepemimpinan untuk anggota baru.", "en": "Leadership training for new members."}'
from departments where slug = 'psdm';
insert into department_programs (department_id, name, description)
select id, '{"id": "Pinrang Mengabdi", "en": "Pinrang Serves"}',
  '{"id": "Bakti sosial tahunan di Kabupaten Pinrang.", "en": "Annual community service in Pinrang Regency."}'
from departments where slug = 'psdm';
insert into department_programs (department_id, name, description)
select id, '{"id": "Media Sosial & Website", "en": "Social Media & Website"}',
  '{"id": "Pengelolaan kanal informasi resmi organisasi.", "en": "Managing the organization''s official information channels."}'
from departments where slug = 'kominfo';

-- Berita (author null => ditampilkan sebagai "Pengurus KMP-UNHAS")
insert into news (title, slug, excerpt, content, thumbnail_url, category_id, status, published_at) values
('{"id": "Latihan Kepemimpinan Dasar 2026 Resmi Dibuka", "en": "Basic Leadership Training 2026 Officially Opened"}',
 'lkd-2026-dibuka',
 '{"id": "Proker unggulan PSDM kembali hadir untuk membina kader baru KMP-UNHAS.", "en": "PSDM''s flagship program returns to train new KMP-UNHAS cadres."}',
 '{"id": "<p>Departemen PSDM resmi membuka Latihan Kepemimpinan Dasar (LKD) 2026. Kegiatan ini menjadi gerbang kaderisasi bagi anggota baru untuk mengenal organisasi lebih dalam, mengasah kepemimpinan, dan membangun kekompakan antar angkatan.</p><p>LKD akan berlangsung selama tiga hari dengan rangkaian materi keorganisasian, kepemimpinan, dan kepinrangan.</p>", "en": "<p>The PSDM Department has officially opened the 2026 Basic Leadership Training (LKD). The program serves as the cadre gateway for new members to learn about the organization, sharpen leadership skills, and build solidarity across cohorts.</p><p>LKD runs for three days covering organizational, leadership, and Pinrang-identity materials.</p>"}',
 '/images/news-placeholder.svg', (select id from news_categories where slug = 'proker'), 'published', now() - interval '2 days'),
('{"id": "Silaturahmi Akbar Alumni KMP-UNHAS", "en": "KMP-UNHAS Alumni Grand Gathering"}',
 'silaturahmi-akbar-alumni',
 '{"id": "Ratusan alumni lintas angkatan berkumpul mempererat jejaring KMP-UNHAS.", "en": "Hundreds of alumni across generations gathered to strengthen the KMP-UNHAS network."}',
 '{"id": "<p>Ikatan alumni KMP-UNHAS menggelar silaturahmi akbar yang dihadiri ratusan alumni lintas angkatan. Acara ini menjadi ruang berbagi pengalaman karier sekaligus penggalangan dukungan untuk program organisasi.</p>", "en": "<p>The KMP-UNHAS alumni association held a grand gathering attended by hundreds of alumni across generations — a space to share career experiences and rally support for the organization''s programs.</p>"}',
 '/images/news-placeholder.svg', (select id from news_categories where slug = 'alumni'), 'published', now() - interval '5 days'),
('{"id": "Pendaftaran Anggota Baru Periode 2026 Dibuka", "en": "New Member Registration for 2026 Now Open"}',
 'pendaftaran-anggota-2026',
 '{"id": "Mahasiswa baru asal Pinrang di UNHAS, mari bergabung bersama kami!", "en": "New UNHAS students from Pinrang, come join us!"}',
 '{"id": "<p>KMP-UNHAS membuka pendaftaran anggota baru bagi seluruh mahasiswa asal Kabupaten Pinrang yang menempuh pendidikan di Universitas Hasanuddin. Pendaftaran dilakukan secara online melalui halaman pendaftaran website ini.</p>", "en": "<p>KMP-UNHAS opens new member registration for all students from Pinrang Regency studying at Hasanuddin University. Registration is done online through this website''s registration page.</p>"}',
 '/images/news-placeholder.svg', (select id from news_categories where slug = 'pengumuman'), 'published', now() - interval '7 days'),
('{"id": "Buka Puasa Bersama dan Santunan Anak Yatim", "en": "Iftar Gathering and Orphan Charity"}',
 'bukber-santunan-2026',
 '{"id": "Departemen Keagamaan menggelar buka puasa bersama dan santunan.", "en": "The Religious Affairs Department held an iftar gathering and charity event."}',
 '{"id": "<p>Dalam suasana Ramadan, Departemen Keagamaan menggelar buka puasa bersama anggota dan santunan bagi anak yatim di sekitar sekretariat. Kegiatan ini mempererat kebersamaan sekaligus menumbuhkan kepedulian sosial.</p>", "en": "<p>In the spirit of Ramadan, the Religious Affairs Department held an iftar gathering and a charity event for orphans near the secretariat — strengthening togetherness while nurturing social care.</p>"}',
 '/images/news-placeholder.svg', (select id from news_categories where slug = 'non-proker'), 'published', now() - interval '12 days'),
('{"id": "Tim Futsal KMP-UNHAS Juara 2 Liga Kerukunan", "en": "KMP-UNHAS Futsal Team Wins 2nd Place in the Association League"}',
 'futsal-juara-liga-kerukunan',
 '{"id": "Prestasi membanggakan dari Departemen Minat dan Bakat.", "en": "A proud achievement from the Talent and Interest Department."}',
 '{"id": "<p>Tim futsal KMP-UNHAS berhasil meraih juara 2 pada Liga Kerukunan antar organisasi kedaerahan se-UNHAS. Pencapaian ini membuktikan pembinaan minat dan bakat anggota berjalan baik.</p>", "en": "<p>The KMP-UNHAS futsal team secured 2nd place in the Association League among regional student organizations at UNHAS — proof that member talent development is on the right track.</p>"}',
 '/images/news-placeholder.svg', (select id from news_categories where slug = 'non-proker'), 'published', now() - interval '20 days'),
('{"id": "Pinrang Mengabdi: Bakti Sosial di Kecamatan Lembang", "en": "Pinrang Serves: Community Service in Lembang District"}',
 'pinrang-mengabdi-lembang',
 '{"id": "Pengabdian tahunan KMP-UNHAS untuk kampung halaman.", "en": "KMP-UNHAS''s annual service for the hometown."}',
 '{"id": "<p>Proker Pinrang Mengabdi tahun ini dilaksanakan di Kecamatan Lembang dengan rangkaian bakti sosial, penyuluhan pendidikan, dan pengobatan gratis bekerja sama dengan pemerintah daerah.</p>", "en": "<p>This year''s Pinrang Serves program took place in Lembang District with community service, education outreach, and free health checks in partnership with the local government.</p>"}',
 '/images/news-placeholder.svg', (select id from news_categories where slug = 'proker'), 'published', now() - interval '30 days');

-- Galeri
insert into gallery_albums (title, slug, description, cover_url, event_date) values
('{"id": "LKD 2025", "en": "Basic Leadership Training 2025"}', 'lkd-2025',
 '{"id": "Dokumentasi Latihan Kepemimpinan Dasar angkatan 2025.", "en": "Documentation of the 2025 Basic Leadership Training."}',
 '/images/gallery-placeholder.svg', '2025-09-20'),
('{"id": "Pinrang Mengabdi 2025", "en": "Pinrang Serves 2025"}', 'pinrang-mengabdi-2025',
 '{"id": "Bakti sosial tahunan di Kabupaten Pinrang.", "en": "Annual community service in Pinrang Regency."}',
 '/images/gallery-placeholder.svg', '2025-07-12');

insert into gallery_photos (album_id, image_url, caption, sort_order)
select a.id, '/images/gallery-placeholder.svg', '{"id": "Sesi materi keorganisasian", "en": "Organizational session"}', n
from gallery_albums a, generate_series(1, 4) n where a.slug = 'lkd-2025';
insert into gallery_photos (album_id, image_url, caption, sort_order)
select a.id, '/images/gallery-placeholder.svg', '{"id": "Kegiatan bakti sosial", "en": "Community service activity"}', n
from gallery_albums a, generate_series(1, 4) n where a.slug = 'pinrang-mengabdi-2025';

-- Agenda
insert into events (title, description, location, start_at, end_at, type, department_id, status) values
('{"id": "Latihan Kepemimpinan Dasar 2026", "en": "Basic Leadership Training 2026"}',
 '{"id": "Kaderisasi anggota baru KMP-UNHAS.", "en": "Cadre training for new KMP-UNHAS members."}',
 'Baruga AP Pettarani UNHAS', now() + interval '14 days', now() + interval '16 days',
 'proker', (select id from departments where slug = 'psdm'), 'upcoming'),
('{"id": "Rapat Kerja Tengah Periode", "en": "Mid-term Work Meeting"}',
 '{"id": "Evaluasi program kerja semester berjalan.", "en": "Evaluation of this semester''s work programs."}',
 'Sekretariat KMP-UNHAS', now() + interval '7 days', null,
 'non_proker', null, 'upcoming'),
('{"id": "Pinrang Mengabdi 2026", "en": "Pinrang Serves 2026"}',
 '{"id": "Bakti sosial tahunan di Kabupaten Pinrang.", "en": "Annual community service in Pinrang Regency."}',
 'Kab. Pinrang', now() + interval '45 days', now() + interval '48 days',
 'proker', (select id from departments where slug = 'psdm'), 'upcoming'),
('{"id": "Musyawarah Besar XXXIV", "en": "34th Grand Assembly"}',
 '{"id": "Forum tertinggi organisasi: LPJ dan pemilihan ketua baru.", "en": "The organization''s highest forum: accountability report and election of a new chair."}',
 'Aula PKM UNHAS', now() - interval '60 days', now() - interval '58 days',
 'non_proker', null, 'done');
