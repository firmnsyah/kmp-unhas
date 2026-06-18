import {
  FALLBACK_ADVISORY,
  FALLBACK_BOARD,
  FALLBACK_COUNCIL,
  FALLBACK_DEPARTMENTS,
  FALLBACK_DEPARTMENT_MEMBERS,
  FALLBACK_DEPARTMENT_PROGRAMS,
} from "@/shared/config/fallback-content";
import { getSupabase, queryOrFallback } from "@/shared/lib/supabase";
import type {
  BoardMember,
  Department,
  DepartmentMember,
  DepartmentProgram,
  OrgCategory,
} from "@/shared/lib/types";

const FALLBACK_BY_CATEGORY: Record<OrgCategory, BoardMember[]> = {
  pengurus_inti: FALLBACK_BOARD,
  pimpinan: FALLBACK_BOARD,
  dewan_pembina: FALLBACK_ADVISORY,
  dewan_pertimbangan: FALLBACK_COUNCIL,
};

export type DepartmentWithMembers = Department & { members: DepartmentMember[] };

/** Semua departemen beserta anggotanya (untuk bagan struktur kepengurusan). */
export async function getDepartmentsWithMembers(): Promise<DepartmentWithMembers[]> {
  return queryOrFallback(
    FALLBACK_DEPARTMENTS.map((d) => ({
      ...d,
      members: FALLBACK_DEPARTMENT_MEMBERS[d.slug] ?? [],
    })),
    (db) => db.from("departments").select("*, members:department_members(*)").order("sort_order"),
    (rows: DepartmentWithMembers[]) =>
      rows.map((r) => ({
        ...r,
        members: [...(r.members ?? [])].sort((a, b) => a.sort_order - b.sort_order),
      })),
  );
}

/** Anggota struktur organisasi per kategori (pengurus inti / pimpinan / dewan). */
export async function getOrgMembers(category: OrgCategory): Promise<BoardMember[]> {
  const db = getSupabase();
  if (!db) return FALLBACK_BY_CATEGORY[category];
  const { data, error } = await db
    .from("org_structure")
    .select("*")
    .eq("category", category)
    .order("sort_order");
  if (error) {
    // Nilai enum 'pengurus_inti' belum ada (migrasi 0004 belum dijalankan) → jangan crash.
    if (/invalid input value for enum|pengurus_inti/i.test(error.message)) return [];
    throw new Error(`Supabase query gagal: ${error.message}`);
  }
  return (data as BoardMember[]) ?? [];
}

export async function getDepartments(): Promise<Department[]> {
  return queryOrFallback(
    FALLBACK_DEPARTMENTS,
    (db) => db.from("departments").select("*").order("sort_order"),
    (rows: Department[]) => rows,
  );
}

export async function getDepartmentBySlug(slug: string): Promise<
  | (Department & { members: DepartmentMember[]; programs: DepartmentProgram[] })
  | null
> {
  const dept = FALLBACK_DEPARTMENTS.find((d) => d.slug === slug);
  const fallback = dept
    ? {
        ...dept,
        members: FALLBACK_DEPARTMENT_MEMBERS[slug] ?? [],
        programs: FALLBACK_DEPARTMENT_PROGRAMS[slug] ?? [],
      }
    : null;

  return queryOrFallback(
    fallback,
    (db) =>
      db
        .from("departments")
        .select("*, members:department_members(*), programs:department_programs(*)")
        .eq("slug", slug)
        .maybeSingle(),
    (
      row:
        | (Department & { members: DepartmentMember[]; programs: DepartmentProgram[] })
        | null,
    ) =>
      row
        ? { ...row, members: [...row.members].sort((a, b) => a.sort_order - b.sort_order) }
        : null,
  );
}
