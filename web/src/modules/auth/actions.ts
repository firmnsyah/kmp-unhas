"use server";

import { getServerSupabase } from "@/shared/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isInternalRole } from "./types";

export type LoginState = { error: string | null };
export type ActionState = { ok: boolean; error: string | null; message?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) return { error: "Email dan kata sandi wajib diisi." };

  const supabase = await getServerSupabase();
  if (!supabase) return { error: "Database belum dikonfigurasi. Hubungi pengelola." };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Email atau kata sandi salah." };

  // Hanya akun internal yang boleh masuk dashboard.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !isInternalRole(profile.role)) {
    await supabase.auth.signOut();
    return { error: "Akun ini tidak memiliki akses dashboard." };
  }
  if (!profile.is_active) {
    await supabase.auth.signOut();
    return { error: "Akun Anda dinonaktifkan. Hubungi Super Admin." };
  }

  redirect(next.startsWith("/dashboard") ? next : "/dashboard");
}

export async function logoutAction() {
  const supabase = await getServerSupabase();
  await supabase?.auth.signOut();
  redirect("/login");
}

export async function updateNameAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  if (fullName.length < 2) return { ok: false, error: "Nama terlalu pendek." };

  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesi berakhir, silakan login ulang." };

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (error) return { ok: false, error: "Gagal menyimpan perubahan." };

  revalidatePath("/dashboard/profil");
  revalidatePath("/dashboard");
  return { ok: true, error: null, message: "Nama berhasil diperbarui." };
}

export async function updatePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { ok: false, error: "Kata sandi minimal 8 karakter." };
  if (password !== confirm) return { ok: false, error: "Konfirmasi kata sandi tidak cocok." };

  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: "Gagal mengganti kata sandi." };

  return { ok: true, error: null, message: "Kata sandi berhasil diperbarui." };
}
