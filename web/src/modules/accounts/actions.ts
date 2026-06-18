"use server";

import type { UserRole } from "@/modules/auth/types";
import { logActivity } from "@/shared/lib/activity";
import { getAdminSupabase, getServerSupabase } from "@/shared/lib/supabase-server";
import { revalidatePath } from "next/cache";

export type AccountResult = { ok: boolean; error?: string };

async function currentRole(): Promise<UserRole | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return (data?.role as UserRole) ?? null;
}

export async function createAccount(formData: FormData): Promise<AccountResult> {
  const role = await currentRole();
  if (role !== "super_admin" && role !== "admin") return { ok: false, error: "Tidak diizinkan." };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const newRole = String(formData.get("role") ?? "panitia") as UserRole;

  if (!fullName || !email || password.length < 8)
    return { ok: false, error: "Lengkapi data; kata sandi minimal 8 karakter." };
  // Admin hanya boleh membuat panitia.
  if (role === "admin" && newRole !== "panitia")
    return { ok: false, error: "Admin hanya dapat membuat akun Panitia." };
  if (!["super_admin", "admin", "panitia"].includes(newRole))
    return { ok: false, error: "Role tidak valid." };

  const admin = getAdminSupabase();
  if (!admin) return { ok: false, error: "Service role belum dikonfigurasi di server." };

  // Trigger handle_new_user akan membuat baris profiles dari user_metadata.
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: newRole },
  });
  if (error) return { ok: false, error: error.message };
  await logActivity("account.create", "profiles", data.user?.id, { role: newRole });

  revalidatePath("/dashboard/akun");
  return { ok: true };
}

export async function setAccountActive(id: string, active: boolean): Promise<AccountResult> {
  const role = await currentRole();
  if (role !== "super_admin" && role !== "admin") return { ok: false, error: "Tidak diizinkan." };
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };

  const { error } = await supabase.from("profiles").update({ is_active: active }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("account.setActive", "profiles", id, { active });
  revalidatePath("/dashboard/akun");
  return { ok: true };
}

export async function setAccountRole(id: string, newRole: UserRole): Promise<AccountResult> {
  const role = await currentRole();
  if (role !== "super_admin") return { ok: false, error: "Hanya Super Admin." };
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };

  const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("account.setRole", "profiles", id, { role: newRole });
  revalidatePath("/dashboard/akun");
  return { ok: true };
}

export async function deleteAccount(id: string): Promise<AccountResult> {
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesi berakhir." };
  if (user.id === id) return { ok: false, error: "Tidak dapat menghapus akun sendiri." };

  const role = await currentRole();
  if (role !== "super_admin") return { ok: false, error: "Hanya Super Admin yang dapat menghapus akun." };

  const admin = getAdminSupabase();
  if (!admin) return { ok: false, error: "Service role belum dikonfigurasi di server." };

  // Menghapus user auth akan menghapus baris profiles (FK on delete cascade).
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { ok: false, error: error.message };
  await logActivity("account.delete", "profiles", id);
  revalidatePath("/dashboard/akun");
  return { ok: true };
}

export async function resetAccountPassword(id: string, password: string): Promise<AccountResult> {
  const role = await currentRole();
  if (role !== "super_admin" && role !== "admin") return { ok: false, error: "Tidak diizinkan." };
  if (password.length < 8) return { ok: false, error: "Kata sandi minimal 8 karakter." };

  const admin = getAdminSupabase();
  if (!admin) return { ok: false, error: "Service role belum dikonfigurasi di server." };
  const { error } = await admin.auth.admin.updateUserById(id, { password });
  if (error) return { ok: false, error: error.message };
  await logActivity("account.resetPassword", "profiles", id);
  return { ok: true };
}
