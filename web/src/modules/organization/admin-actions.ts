"use server";

import { logActivity } from "@/shared/lib/activity";
import { getAdminContext, isSuperAdmin } from "@/shared/lib/admin-guard";
import { slugify } from "@/shared/lib/slug";
import { revalidatePath } from "next/cache";

export type OrgResult = { ok: boolean; error?: string };

function revalidateOrg() {
  revalidatePath("/dashboard/struktur");
  revalidatePath("/tentang/struktur-kepengurusan");
  revalidatePath("/tentang/pimpinan");
  revalidatePath("/tentang/dewan-pembina");
  revalidatePath("/tentang/dewan-pertimbangan");
  revalidatePath("/tentang/departemen");
}

async function guard() {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { supabase: null, error: "Database belum dikonfigurasi." };
  if (!isSuperAdmin(role)) return { supabase: null, error: "Hanya Super Admin." };
  return { supabase, error: null };
}

// ===== Pengurus inti & dewan (org_structure) =====
export async function saveMember(formData: FormData): Promise<OrgResult> {
  const { supabase, error } = await guard();
  if (!supabase) return { ok: false, error: error! };

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const batch = String(formData.get("batch") ?? "").trim() || null;
  const period = String(formData.get("period") ?? "").trim();
  const category = String(formData.get("category") ?? "pimpinan");
  const photoUrl = String(formData.get("photo_url") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  if (!name || !position || !period) return { ok: false, error: "Nama, jabatan, dan periode wajib diisi." };

  const payload = { name, position: { id: position }, batch, period, category, photo_url: photoUrl, sort_order: sortOrder };
  const res = id
    ? await supabase.from("org_structure").update(payload).eq("id", id)
    : await supabase.from("org_structure").insert(payload);
  if (res.error) return { ok: false, error: res.error.message };
  await logActivity(id ? "member.update" : "member.create", "org_structure", id || undefined);
  revalidateOrg();
  return { ok: true };
}

export async function deleteMember(id: string): Promise<OrgResult> {
  const { supabase, error } = await guard();
  if (!supabase) return { ok: false, error: error! };
  const { error: e } = await supabase.from("org_structure").delete().eq("id", id);
  if (e) return { ok: false, error: e.message };
  revalidateOrg();
  return { ok: true };
}

// ===== Departemen =====
export async function saveDepartment(formData: FormData): Promise<OrgResult> {
  const { supabase, error } = await guard();
  if (!supabase) return { ok: false, error: error! };

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name_id") ?? "").trim();
  const desc = String(formData.get("description_id") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  if (!name || !slug) return { ok: false, error: "Nama departemen wajib diisi." };

  const payload = { name: { id: name }, description: desc ? { id: desc } : null, image_url: imageUrl, sort_order: sortOrder, slug };
  const res = id
    ? await supabase.from("departments").update(payload).eq("id", id)
    : await supabase.from("departments").insert(payload);
  if (res.error) return { ok: false, error: res.error.message };
  await logActivity(id ? "department.update" : "department.create", "departments", id || undefined);
  revalidateOrg();
  return { ok: true };
}

export async function deleteDepartment(id: string): Promise<OrgResult> {
  const { supabase, error } = await guard();
  if (!supabase) return { ok: false, error: error! };
  const { error: e } = await supabase.from("departments").delete().eq("id", id);
  if (e) return { ok: false, error: e.message };
  revalidateOrg();
  return { ok: true };
}

// ===== Anggota & program departemen =====
export async function saveDeptMember(formData: FormData): Promise<OrgResult> {
  const { supabase, error } = await guard();
  if (!supabase) return { ok: false, error: error! };
  const id = String(formData.get("id") ?? "");
  const departmentId = String(formData.get("department_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const batch = String(formData.get("batch") ?? "").trim() || null;
  const photoUrl = String(formData.get("photo_url") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  if (!departmentId || !name || !position) return { ok: false, error: "Nama dan jabatan wajib diisi." };

  const payload = { department_id: departmentId, name, position: { id: position }, batch, photo_url: photoUrl, sort_order: sortOrder };
  const res = id
    ? await supabase.from("department_members").update(payload).eq("id", id)
    : await supabase.from("department_members").insert(payload);
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/struktur/departemen/${departmentId}`);
  revalidatePath(`/tentang/struktur-organisasi/${departmentId}`);
  return { ok: true };
}

export async function deleteDeptMember(id: string, departmentId: string): Promise<OrgResult> {
  const { supabase, error } = await guard();
  if (!supabase) return { ok: false, error: error! };
  const { error: e } = await supabase.from("department_members").delete().eq("id", id);
  if (e) return { ok: false, error: e.message };
  revalidatePath(`/dashboard/struktur/departemen/${departmentId}`);
  return { ok: true };
}

export async function saveDeptProgram(formData: FormData): Promise<OrgResult> {
  const { supabase, error } = await guard();
  if (!supabase) return { ok: false, error: error! };
  const id = String(formData.get("id") ?? "");
  const departmentId = String(formData.get("department_id") ?? "");
  const name = String(formData.get("name_id") ?? "").trim();
  const desc = String(formData.get("description_id") ?? "").trim();
  if (!departmentId || !name) return { ok: false, error: "Nama program wajib diisi." };

  const payload = { department_id: departmentId, name: { id: name }, description: desc ? { id: desc } : null };
  const res = id
    ? await supabase.from("department_programs").update(payload).eq("id", id)
    : await supabase.from("department_programs").insert(payload);
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/struktur/departemen/${departmentId}`);
  return { ok: true };
}

export async function deleteDeptProgram(id: string, departmentId: string): Promise<OrgResult> {
  const { supabase, error } = await guard();
  if (!supabase) return { ok: false, error: error! };
  const { error: e } = await supabase.from("department_programs").delete().eq("id", id);
  if (e) return { ok: false, error: e.message };
  revalidatePath(`/dashboard/struktur/departemen/${departmentId}`);
  return { ok: true };
}
