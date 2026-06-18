import type { UserRole } from "@/modules/auth/types";
import {
  CalendarDays,
  CheckSquare,
  FileText,
  Images,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Network,
  Newspaper,
  ScrollText,
  Settings,
  Tags,
  UserCircle,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

const ALL_INTERNAL: UserRole[] = ["super_admin", "admin", "panitia"];
const ADMINS: UserRole[] = ["super_admin", "admin"];
const SUPER: UserRole[] = ["super_admin"];

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Utama",
    items: [
      { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, roles: ALL_INTERNAL },
    ],
  },
  {
    label: "Konten",
    items: [
      { href: "/dashboard/berita", label: "Berita", icon: Newspaper, roles: ALL_INTERNAL },
      { href: "/dashboard/approval", label: "Approval Berita", icon: CheckSquare, roles: ADMINS },
      { href: "/dashboard/kategori", label: "Kategori", icon: Tags, roles: ADMINS },
      { href: "/dashboard/komentar", label: "Komentar", icon: MessageSquare, roles: ADMINS },
      { href: "/dashboard/galeri", label: "Galeri", icon: Images, roles: ADMINS },
      { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays, roles: ADMINS },
      { href: "/dashboard/form", label: "Form Dinamis", icon: FileText, roles: ADMINS },
    ],
  },
  {
    label: "Data Masuk",
    items: [
      { href: "/dashboard/pendaftar", label: "Pendaftar", icon: UserPlus, roles: ADMINS },
      { href: "/dashboard/pesan", label: "Pesan Kontak", icon: Mail, roles: ADMINS },
    ],
  },
  {
    label: "Pengelolaan",
    items: [
      { href: "/dashboard/akun", label: "Manajemen Akun", icon: Users, roles: ADMINS },
      { href: "/dashboard/konten", label: "Konten Website", icon: Settings, roles: SUPER },
      { href: "/dashboard/struktur", label: "Struktur Organisasi", icon: Network, roles: SUPER },
      { href: "/dashboard/log", label: "Log Aktivitas", icon: ScrollText, roles: SUPER },
    ],
  },
  {
    label: "Akun",
    items: [
      { href: "/dashboard/profil", label: "Pengaturan Profil", icon: UserCircle, roles: ALL_INTERNAL },
    ],
  },
];

export function navGroupsForRole(role: UserRole): NavGroup[] {
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(role)),
  })).filter((group) => group.items.length > 0);
}

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  panitia: "Panitia",
  public: "Publik",
};

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role;
}
