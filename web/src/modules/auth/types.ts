// Tipe & util role yang aman dipakai di client (tanpa impor server-only).

export type UserRole = "super_admin" | "admin" | "panitia" | "public";

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
};

export function isInternalRole(role?: string | null): boolean {
  return role === "super_admin" || role === "admin" || role === "panitia";
}
