import { getServerSupabase } from "@/shared/lib/supabase-server";
import type { BoardMember, Department, DepartmentMember, DepartmentProgram } from "@/shared/lib/types";

export async function getAllOrgMembers(): Promise<BoardMember[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("org_structure")
    .select("*")
    .order("category")
    .order("sort_order");
  return (data as BoardMember[]) ?? [];
}

export async function getDepartmentById(
  id: string,
): Promise<(Department & { members: DepartmentMember[]; programs: DepartmentProgram[] }) | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("departments")
    .select("*, members:department_members(*), programs:department_programs(*)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const dept = data as Department & { members: DepartmentMember[]; programs: DepartmentProgram[] };
  return { ...dept, members: [...dept.members].sort((a, b) => a.sort_order - b.sort_order) };
}
