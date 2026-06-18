// Data demo yang dipakai ketika Supabase belum dikonfigurasi (dev pertama kali).
// Isinya cermin dari supabase/migrations/0002_seed.sql — setelah Supabase
// terhubung, data asli dari database yang dipakai.

import type {
  AboutContent,
  BoardMember,
  ChairmanContent,
  ContactContent,
  Department,
  DepartmentMember,
  DepartmentProgram,
  GalleryAlbum,
  GalleryPhoto,
  HeroContent,
  MarsContent,
  News,
  NewsCategory,
  OrgEvent,
  PrivacyContent,
  SettingsContent,
  StatsContent,
} from "@/shared/lib/types";

const day = 24 * 60 * 60 * 1000;
const daysFromNow = (n: number) => new Date(Date.now() + n * day).toISOString();

export const FALLBACK_SETTINGS: SettingsContent = {
  site_name: "KMP-UNHAS",
  registration_open: true,
  footer_text: {
    id: "Kerukunan Mahasiswa Pinrang Universitas Hasanuddin",
    en: "Pinrang Students Association of Hasanuddin University",
  },
};

export const FALLBACK_HERO: HeroContent = {
  title: { id: "Kerukunan Mahasiswa Pinrang", en: "Pinrang Students Association" },
  subtitle: { id: "Universitas Hasanuddin", en: "Hasanuddin University" },
  description: {
    id: "Wadah silaturahmi, pengembangan diri, dan pengabdian mahasiswa asal Kabupaten Pinrang yang menempuh pendidikan di Universitas Hasanuddin.",
    en: "A home for connection, self-development, and community service for students from Pinrang Regency studying at Hasanuddin University.",
  },
  images: ["/images/hero1.webp", "/images/hero2.webp", "/images/hero3.jpg"],
};

export const FALLBACK_STATS: StatsContent = {
  founded: 1989,
  members: 250,
  departments: 5,
  programs: 14,
};

export const FALLBACK_CHAIRMAN: ChairmanContent = {
  name: "Mustaqim Akbar",
  period: "2025/2026",
  photo_url: "/images/avatar-placeholder.svg",
  quote: {
    id: "KMP-UNHAS adalah rumah kedua bagi mahasiswa Pinrang di Makassar. Mari tumbuh, berkarya, dan mengabdi bersama untuk kampung halaman.",
    en: "KMP-UNHAS is a second home for Pinrang students in Makassar. Let us grow, create, and serve our hometown together.",
  },
};

export const FALLBACK_ABOUT: AboutContent = {
  history: {
    id: "<p>KMP-UNHAS (Kerukunan Mahasiswa Pinrang Universitas Hasanuddin) berdiri sebagai wadah persaudaraan mahasiswa asal Kabupaten Pinrang yang menempuh pendidikan di Universitas Hasanuddin. Sejak didirikan, organisasi ini aktif membina anggota melalui kaderisasi, kegiatan sosial, dan program pengabdian ke kampung halaman.</p>",
    en: "<p>KMP-UNHAS (Pinrang Students Association of Hasanuddin University) was founded as a brotherhood for students from Pinrang Regency studying at Hasanuddin University. Since its founding, the organization has nurtured its members through cadre development, social activities, and hometown service programs.</p>",
  },
  vision: {
    id: "Menjadi organisasi kedaerahan yang solid, profesional, dan bermanfaat bagi anggota serta masyarakat Pinrang.",
    en: "To be a solid, professional regional organization that benefits its members and the people of Pinrang.",
  },
  missions: {
    id: [
      "Mempererat silaturahmi antar mahasiswa Pinrang di UNHAS",
      "Mengembangkan potensi akademik, minat, dan bakat anggota",
      "Berkontribusi nyata bagi pembangunan Kabupaten Pinrang",
      "Menjalin kemitraan dengan pemerintah daerah dan alumni",
    ],
    en: [
      "Strengthen the bonds among Pinrang students at UNHAS",
      "Develop members' academic potential, interests, and talents",
      "Contribute tangibly to the development of Pinrang Regency",
      "Build partnerships with the local government and alumni",
    ],
  },
  purpose: {
    id: [
      "Menghimpun dan mempersatukan mahasiswa asal Kabupaten Pinrang di Universitas Hasanuddin",
      "Membentuk anggota yang berintegritas, berprestasi, dan berjiwa kepemimpinan",
      "Menjadi penghubung antara mahasiswa Pinrang dengan masyarakat dan pemerintah daerah",
    ],
    en: [
      "Gather and unite students from Pinrang Regency at Hasanuddin University",
      "Shape members with integrity, achievement, and leadership spirit",
      "Bridge Pinrang students with the community and local government",
    ],
  },
  efforts: {
    id: [
      "Menyelenggarakan kaderisasi dan pelatihan pengembangan diri",
      "Mengadakan kegiatan sosial, keagamaan, serta minat dan bakat",
      "Menjalin kerja sama dengan alumni, kampus, dan pemerintah daerah",
      "Mengelola kanal informasi dan dokumentasi organisasi",
    ],
    en: [
      "Conduct cadre development and self-improvement training",
      "Hold social, religious, and talent-based activities",
      "Build cooperation with alumni, campus, and local government",
      "Manage the organization's information and documentation channels",
    ],
  },
  logo_philosophy: {
    id: "Warna merah melambangkan keberanian dan semangat juang, biru melambangkan keluasan ilmu dan kedalaman persaudaraan.",
    en: "Red symbolizes courage and fighting spirit; blue symbolizes the breadth of knowledge and the depth of brotherhood.",
  },
  logo_download_url: "/images/logo.png",
  logo_creator: {
    name: "Tim Kominfo KMP-UNHAS",
    photo_url: "/images/avatar-placeholder.svg",
    description: {
      id: "Logo resmi KMP-UNHAS dirancang oleh tim kreatif organisasi sebagai identitas kebanggaan bersama. (Keterangan ini contoh — silakan perbarui melalui dashboard.)",
      en: "The official KMP-UNHAS logo was designed by the organization's creative team as a shared identity. (This description is a placeholder — please update it via the dashboard.)",
    },
  },
};

export const FALLBACK_CONTACT: ContactContent = {
  address: "Sekretariat KMP-UNHAS, Jl. Perintis Kemerdekaan KM 10, Tamalanrea, Makassar",
  email: "kmpunhas@gmail.com",
  phone: "+62 821-0000-0000",
  instagram: "https://instagram.com/kmp_unhas",
  youtube: "",
  tiktok: "",
  maps_embed: "https://www.google.com/maps?q=-5.1343974,119.4805851&z=17&output=embed",
};

export const FALLBACK_PRIVACY: PrivacyContent = {
  content: {
    id: "<h2>Kebijakan Privasi</h2><p>KMP-UNHAS menghormati privasi Anda. Data pribadi yang dikumpulkan melalui form pendaftaran dan form kegiatan (nama, NIM, kontak) hanya digunakan untuk keperluan administrasi organisasi dan tidak dibagikan kepada pihak ketiga.</p><p>Login Google hanya digunakan untuk identitas komentar dan pengisian form. Anda dapat meminta penghapusan data dengan menghubungi pengurus.</p>",
    en: "<h2>Privacy Policy</h2><p>KMP-UNHAS respects your privacy. Personal data collected through registration and activity forms (name, student ID, contact) is used solely for organizational administration and is never shared with third parties.</p><p>Google sign-in is used only for comment identity and form submissions. You may request data deletion by contacting the board.</p>",
  },
};

export const FALLBACK_MARS: MarsContent = {
  lyrics: {
    id: "Kerukunan Mahasiswa Pinrang\nBersatu padu dalam satu tekad\nMenuntut ilmu di Hasanuddin\nMengabdi tulus untuk negeri\n\nDari Pinrang kami berasal\nMembawa cita menggapai asa\nJunjung tinggi nama almamater\nKMP-UNHAS jaya selalu\n\n(Lirik mars ini masih contoh — silakan ganti dengan lirik resmi melalui dashboard.)",
    en: "Pinrang Students Association\nUnited in one resolve\nSeeking knowledge at Hasanuddin\nServing sincerely for the nation\n\nFrom Pinrang we come\nCarrying dreams to reach our hopes\nUpholding the name of our alma mater\nKMP-UNHAS, forever glorious\n\n(These anthem lyrics are a placeholder — please replace them with the official lyrics via the dashboard.)",
  },
  video_url: "https://www.youtube.com/watch?v=y_Y_VhOUqnQ",
};

export const FALLBACK_CATEGORIES: NewsCategory[] = [
  { id: "cat-proker", name: { id: "Proker", en: "Work Program" }, slug: "proker" },
  { id: "cat-nonproker", name: { id: "Non-Proker", en: "Non-Program" }, slug: "non-proker" },
  { id: "cat-alumni", name: { id: "Alumni", en: "Alumni" }, slug: "alumni" },
  { id: "cat-pengumuman", name: { id: "Pengumuman", en: "Announcement" }, slug: "pengumuman" },
];

export const FALLBACK_NEWS: News[] = [
  {
    id: "news-1",
    title: { id: "Latihan Kepemimpinan Dasar 2026 Resmi Dibuka", en: "Basic Leadership Training 2026 Officially Opened" },
    slug: "lkd-2026-dibuka",
    excerpt: { id: "Proker unggulan PSDM kembali hadir untuk membina kader baru KMP-UNHAS.", en: "PSDM's flagship program returns to train new KMP-UNHAS cadres." },
    content: {
      id: "<p>Departemen PSDM resmi membuka Latihan Kepemimpinan Dasar (LKD) 2026. Kegiatan ini menjadi gerbang kaderisasi bagi anggota baru untuk mengenal organisasi lebih dalam, mengasah kepemimpinan, dan membangun kekompakan antar angkatan.</p><p>LKD akan berlangsung selama tiga hari dengan rangkaian materi keorganisasian, kepemimpinan, dan kepinrangan.</p>",
      en: "<p>The PSDM Department has officially opened the 2026 Basic Leadership Training (LKD). The program serves as the cadre gateway for new members to learn about the organization, sharpen leadership skills, and build solidarity across cohorts.</p><p>LKD runs for three days covering organizational, leadership, and Pinrang-identity materials.</p>",
    },
    thumbnail_url: "/images/news-placeholder.svg",
    category: FALLBACK_CATEGORIES[0],
    author_name: null,
    published_at: daysFromNow(-2),
  },
  {
    id: "news-2",
    title: { id: "Silaturahmi Akbar Alumni KMP-UNHAS", en: "KMP-UNHAS Alumni Grand Gathering" },
    slug: "silaturahmi-akbar-alumni",
    excerpt: { id: "Ratusan alumni lintas angkatan berkumpul mempererat jejaring KMP-UNHAS.", en: "Hundreds of alumni across generations gathered to strengthen the KMP-UNHAS network." },
    content: {
      id: "<p>Ikatan alumni KMP-UNHAS menggelar silaturahmi akbar yang dihadiri ratusan alumni lintas angkatan. Acara ini menjadi ruang berbagi pengalaman karier sekaligus penggalangan dukungan untuk program organisasi.</p>",
      en: "<p>The KMP-UNHAS alumni association held a grand gathering attended by hundreds of alumni across generations — a space to share career experiences and rally support for the organization's programs.</p>",
    },
    thumbnail_url: "/images/news-placeholder.svg",
    category: FALLBACK_CATEGORIES[2],
    author_name: null,
    published_at: daysFromNow(-5),
  },
  {
    id: "news-3",
    title: { id: "Pendaftaran Anggota Baru Periode 2026 Dibuka", en: "New Member Registration for 2026 Now Open" },
    slug: "pendaftaran-anggota-2026",
    excerpt: { id: "Mahasiswa baru asal Pinrang di UNHAS, mari bergabung bersama kami!", en: "New UNHAS students from Pinrang, come join us!" },
    content: {
      id: "<p>KMP-UNHAS membuka pendaftaran anggota baru bagi seluruh mahasiswa asal Kabupaten Pinrang yang menempuh pendidikan di Universitas Hasanuddin. Pendaftaran dilakukan secara online melalui halaman pendaftaran website ini.</p>",
      en: "<p>KMP-UNHAS opens new member registration for all students from Pinrang Regency studying at Hasanuddin University. Registration is done online through this website's registration page.</p>",
    },
    thumbnail_url: "/images/news-placeholder.svg",
    category: FALLBACK_CATEGORIES[3],
    author_name: null,
    published_at: daysFromNow(-7),
  },
  {
    id: "news-4",
    title: { id: "Buka Puasa Bersama dan Santunan Anak Yatim", en: "Iftar Gathering and Orphan Charity" },
    slug: "bukber-santunan-2026",
    excerpt: { id: "Departemen Keagamaan menggelar buka puasa bersama dan santunan.", en: "The Religious Affairs Department held an iftar gathering and charity event." },
    content: {
      id: "<p>Dalam suasana Ramadan, Departemen Keagamaan menggelar buka puasa bersama anggota dan santunan bagi anak yatim di sekitar sekretariat. Kegiatan ini mempererat kebersamaan sekaligus menumbuhkan kepedulian sosial.</p>",
      en: "<p>In the spirit of Ramadan, the Religious Affairs Department held an iftar gathering and a charity event for orphans near the secretariat — strengthening togetherness while nurturing social care.</p>",
    },
    thumbnail_url: "/images/news-placeholder.svg",
    category: FALLBACK_CATEGORIES[1],
    author_name: null,
    published_at: daysFromNow(-12),
  },
  {
    id: "news-5",
    title: { id: "Tim Futsal KMP-UNHAS Juara 2 Liga Kerukunan", en: "KMP-UNHAS Futsal Team Wins 2nd Place in the Association League" },
    slug: "futsal-juara-liga-kerukunan",
    excerpt: { id: "Prestasi membanggakan dari Departemen Minat dan Bakat.", en: "A proud achievement from the Talent and Interest Department." },
    content: {
      id: "<p>Tim futsal KMP-UNHAS berhasil meraih juara 2 pada Liga Kerukunan antar organisasi kedaerahan se-UNHAS. Pencapaian ini membuktikan pembinaan minat dan bakat anggota berjalan baik.</p>",
      en: "<p>The KMP-UNHAS futsal team secured 2nd place in the Association League among regional student organizations at UNHAS — proof that member talent development is on the right track.</p>",
    },
    thumbnail_url: "/images/news-placeholder.svg",
    category: FALLBACK_CATEGORIES[1],
    author_name: null,
    published_at: daysFromNow(-20),
  },
  {
    id: "news-6",
    title: { id: "Pinrang Mengabdi: Bakti Sosial di Kecamatan Lembang", en: "Pinrang Serves: Community Service in Lembang District" },
    slug: "pinrang-mengabdi-lembang",
    excerpt: { id: "Pengabdian tahunan KMP-UNHAS untuk kampung halaman.", en: "KMP-UNHAS's annual service for the hometown." },
    content: {
      id: "<p>Proker Pinrang Mengabdi tahun ini dilaksanakan di Kecamatan Lembang dengan rangkaian bakti sosial, penyuluhan pendidikan, dan pengobatan gratis bekerja sama dengan pemerintah daerah.</p>",
      en: "<p>This year's Pinrang Serves program took place in Lembang District with community service, education outreach, and free health checks in partnership with the local government.</p>",
    },
    thumbnail_url: "/images/news-placeholder.svg",
    category: FALLBACK_CATEGORIES[0],
    author_name: null,
    published_at: daysFromNow(-30),
  },
];

export const FALLBACK_DEPARTMENTS: Department[] = [
  {
    id: "dept-psdm",
    name: { id: "Pengembangan Sumber Daya Manusia", en: "Human Resource Development" },
    slug: "psdm",
    description: { id: "Kaderisasi dan pengembangan kapasitas anggota melalui pelatihan dan mentoring.", en: "Cadre building and member capacity development through training and mentoring." },
    image_url: "/images/dept-placeholder.svg",
    sort_order: 1,
  },
  {
    id: "dept-kominfo",
    name: { id: "Komunikasi dan Informasi", en: "Communication and Information" },
    slug: "kominfo",
    description: { id: "Publikasi, dokumentasi, dan pengelolaan media sosial serta website organisasi.", en: "Publication, documentation, and management of the organization's social media and website." },
    image_url: "/images/dept-placeholder.svg",
    sort_order: 2,
  },
  {
    id: "dept-keagamaan",
    name: { id: "Keagamaan", en: "Religious Affairs" },
    slug: "keagamaan",
    description: { id: "Pembinaan kerohanian dan kegiatan keagamaan anggota.", en: "Spiritual development and religious activities for members." },
    image_url: "/images/dept-placeholder.svg",
    sort_order: 3,
  },
  {
    id: "dept-minat-bakat",
    name: { id: "Minat dan Bakat", en: "Talent and Interest" },
    slug: "minat-bakat",
    description: { id: "Pengembangan minat olahraga, seni, dan kreativitas anggota.", en: "Developing members' interests in sports, arts, and creativity." },
    image_url: "/images/dept-placeholder.svg",
    sort_order: 4,
  },
  {
    id: "dept-danus",
    name: { id: "Dana dan Usaha", en: "Funding and Enterprise" },
    slug: "danus",
    description: { id: "Penggalangan dana dan pengembangan unit usaha organisasi.", en: "Fundraising and development of the organization's business units." },
    image_url: "/images/dept-placeholder.svg",
    sort_order: 5,
  },
];

export const FALLBACK_DEPARTMENT_MEMBERS: Record<string, DepartmentMember[]> = {
  psdm: [
    { id: "dm-1", name: "Muh. Alif Hidayat", position: { id: "Kepala Departemen", en: "Head of Department" }, photo_url: "/images/avatar-placeholder.svg", batch: "2022", sort_order: 1 },
    { id: "dm-2", name: "Fitri Handayani", position: { id: "Sekretaris Departemen", en: "Department Secretary" }, photo_url: "/images/avatar-placeholder.svg", batch: "2023", sort_order: 2 },
  ],
  kominfo: [
    { id: "dm-3", name: "A. Muh. Farhan", position: { id: "Kepala Departemen", en: "Head of Department" }, photo_url: "/images/avatar-placeholder.svg", batch: "2022", sort_order: 1 },
  ],
};

export const FALLBACK_DEPARTMENT_PROGRAMS: Record<string, DepartmentProgram[]> = {
  psdm: [
    { id: "dp-1", name: { id: "Latihan Kepemimpinan Dasar", en: "Basic Leadership Training" }, description: { id: "Pelatihan kepemimpinan untuk anggota baru.", en: "Leadership training for new members." } },
    { id: "dp-2", name: { id: "Pinrang Mengabdi", en: "Pinrang Serves" }, description: { id: "Bakti sosial tahunan di Kabupaten Pinrang.", en: "Annual community service in Pinrang Regency." } },
  ],
  kominfo: [
    { id: "dp-3", name: { id: "Media Sosial & Website", en: "Social Media & Website" }, description: { id: "Pengelolaan kanal informasi resmi organisasi.", en: "Managing the organization's official information channels." } },
  ],
};

export const FALLBACK_BOARD: BoardMember[] = [
  { id: "b-1", name: "Mustaqim Akbar", position: { id: "Ketua Umum", en: "Chairperson" }, photo_url: "/images/avatar-placeholder.svg", batch: "2022", period: "2025/2026", category: "pimpinan", sort_order: 1 },
  { id: "b-2", name: "Andi Tenri Abeng", position: { id: "Wakil Ketua", en: "Vice Chairperson" }, photo_url: "/images/avatar-placeholder.svg", batch: "2022", period: "2025/2026", category: "pimpinan", sort_order: 2 },
  { id: "b-3", name: "Nurul Izzah", position: { id: "Sekretaris Umum", en: "General Secretary" }, photo_url: "/images/avatar-placeholder.svg", batch: "2023", period: "2025/2026", category: "pimpinan", sort_order: 3 },
  { id: "b-4", name: "Ahmad Dzaki", position: { id: "Wakil Sekretaris", en: "Deputy Secretary" }, photo_url: "/images/avatar-placeholder.svg", batch: "2023", period: "2025/2026", category: "pimpinan", sort_order: 4 },
  { id: "b-5", name: "Sitti Rahmadani", position: { id: "Bendahara Umum", en: "General Treasurer" }, photo_url: "/images/avatar-placeholder.svg", batch: "2022", period: "2025/2026", category: "pimpinan", sort_order: 5 },
  { id: "b-6", name: "Reski Amalia", position: { id: "Wakil Bendahara", en: "Deputy Treasurer" }, photo_url: "/images/avatar-placeholder.svg", batch: "2023", period: "2025/2026", category: "pimpinan", sort_order: 6 },
];

export const FALLBACK_ADVISORY: BoardMember[] = [
  { id: "dp-1", name: "Prof. Dr. H. Andi Pattola", position: { id: "Pembina", en: "Patron" }, photo_url: "/images/avatar-placeholder.svg", batch: "1998", period: "2025/2026", category: "dewan_pembina", sort_order: 1 },
  { id: "dp-2", name: "Dr. Hj. Sitti Nurhayati", position: { id: "Pembina", en: "Patron" }, photo_url: "/images/avatar-placeholder.svg", batch: "2001", period: "2025/2026", category: "dewan_pembina", sort_order: 2 },
];

export const FALLBACK_COUNCIL: BoardMember[] = [
  { id: "dpo-1", name: "Muh. Yusuf Tahir", position: { id: "Ketua Dewan Pertimbangan", en: "Council Chair" }, photo_url: "/images/avatar-placeholder.svg", batch: "2018", period: "2025/2026", category: "dewan_pertimbangan", sort_order: 1 },
  { id: "dpo-2", name: "A. Nurul Fadhilah", position: { id: "Anggota", en: "Member" }, photo_url: "/images/avatar-placeholder.svg", batch: "2019", period: "2025/2026", category: "dewan_pertimbangan", sort_order: 2 },
  { id: "dpo-3", name: "Rahmat Hidayat", position: { id: "Anggota", en: "Member" }, photo_url: "/images/avatar-placeholder.svg", batch: "2019", period: "2025/2026", category: "dewan_pertimbangan", sort_order: 3 },
];

const galleryPhotos = (albumPrefix: string, caption: { id: string; en: string }): GalleryPhoto[] =>
  Array.from({ length: 4 }, (_, i) => ({
    id: `${albumPrefix}-photo-${i + 1}`,
    image_url: "/images/gallery-placeholder.svg",
    caption,
    sort_order: i + 1,
  }));

export const FALLBACK_ALBUMS: GalleryAlbum[] = [
  {
    id: "album-1",
    title: { id: "LKD 2025", en: "Basic Leadership Training 2025" },
    slug: "lkd-2025",
    description: { id: "Dokumentasi Latihan Kepemimpinan Dasar angkatan 2025.", en: "Documentation of the 2025 Basic Leadership Training." },
    cover_url: "/images/gallery-placeholder.svg",
    event_date: "2025-09-20",
    photo_count: 4,
  },
  {
    id: "album-2",
    title: { id: "Pinrang Mengabdi 2025", en: "Pinrang Serves 2025" },
    slug: "pinrang-mengabdi-2025",
    description: { id: "Bakti sosial tahunan di Kabupaten Pinrang.", en: "Annual community service in Pinrang Regency." },
    cover_url: "/images/gallery-placeholder.svg",
    event_date: "2025-07-12",
    photo_count: 4,
  },
];

export const FALLBACK_ALBUM_PHOTOS: Record<string, GalleryPhoto[]> = {
  "lkd-2025": galleryPhotos("album-1", { id: "Sesi materi keorganisasian", en: "Organizational session" }),
  "pinrang-mengabdi-2025": galleryPhotos("album-2", { id: "Kegiatan bakti sosial", en: "Community service activity" }),
};

export const FALLBACK_EVENTS: OrgEvent[] = [
  {
    id: "event-1",
    title: { id: "Latihan Kepemimpinan Dasar 2026", en: "Basic Leadership Training 2026" },
    description: { id: "Kaderisasi anggota baru KMP-UNHAS.", en: "Cadre training for new KMP-UNHAS members." },
    location: "Baruga AP Pettarani UNHAS",
    start_at: daysFromNow(14),
    end_at: daysFromNow(16),
    image_url: null,
    type: "proker",
    department_name: { id: "Pengembangan Sumber Daya Manusia", en: "Human Resource Development" },
    status: "upcoming",
  },
  {
    id: "event-2",
    title: { id: "Rapat Kerja Tengah Periode", en: "Mid-term Work Meeting" },
    description: { id: "Evaluasi program kerja semester berjalan.", en: "Evaluation of this semester's work programs." },
    location: "Sekretariat KMP-UNHAS",
    start_at: daysFromNow(7),
    end_at: null,
    image_url: null,
    type: "non_proker",
    department_name: null,
    status: "upcoming",
  },
  {
    id: "event-3",
    title: { id: "Pinrang Mengabdi 2026", en: "Pinrang Serves 2026" },
    description: { id: "Bakti sosial tahunan di Kabupaten Pinrang.", en: "Annual community service in Pinrang Regency." },
    location: "Kab. Pinrang",
    start_at: daysFromNow(45),
    end_at: daysFromNow(48),
    image_url: null,
    type: "proker",
    department_name: { id: "Pengembangan Sumber Daya Manusia", en: "Human Resource Development" },
    status: "upcoming",
  },
  {
    id: "event-4",
    title: { id: "Musyawarah Besar XXXIV", en: "34th Grand Assembly" },
    description: { id: "Forum tertinggi organisasi: LPJ dan pemilihan ketua baru.", en: "The organization's highest forum: accountability report and election of a new chair." },
    location: "Aula PKM UNHAS",
    start_at: daysFromNow(-60),
    end_at: daysFromNow(-58),
    image_url: null,
    type: "non_proker",
    department_name: null,
    status: "done",
  },
];
