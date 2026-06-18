"use server";

import { getAdminSupabase, getServerSupabase } from "@/shared/lib/supabase-server";

export type SubmitResult = { ok: boolean; error?: string };
export type UploadResult = { ok: boolean; url?: string; error?: string };

/**
 * Unggah file/gambar jawaban form. Pengisi form (user Google) berperan 'public'
 * sehingga TIDAK boleh menulis ke storage via RLS. Maka unggah dilakukan di
 * server pakai service role (bypass RLS) ke bucket publik 'forms' (prefix responses/).
 */
export async function uploadFormFile(formData: FormData): Promise<UploadResult> {
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Silakan login dengan Google terlebih dahulu." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "File tidak valid." };

  const isImage = file.type.startsWith("image/");
  const maxMb = isImage ? 5 : 20;
  if (file.size > maxMb * 1024 * 1024) return { ok: false, error: `Ukuran maksimal ${maxMb}MB.` };

  const admin = getAdminSupabase();
  if (!admin) return { ok: false, error: "Penyimpanan belum dikonfigurasi di server." };

  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]+/g, "") || "bin";
  const path = `responses/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage
    .from("forms")
    .upload(path, buffer, { contentType: file.type || "application/octet-stream", upsert: false });
  if (error) return { ok: false, error: error.message };

  const { data } = admin.storage.from("forms").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

/** Kirim respons form (wajib login user publik via Google). */
export async function submitFormResponse(
  formId: string,
  answers: Record<string, unknown>,
): Promise<SubmitResult> {
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Silakan login dengan Google terlebih dahulu." };

  const { data: form } = await supabase
    .from("forms")
    .select("is_active, deadline_at, one_response_per_user, allow_edit_response")
    .eq("id", formId)
    .maybeSingle();
  if (!form) return { ok: false, error: "Form tidak ditemukan." };
  if (!form.is_active || new Date(form.deadline_at) < new Date())
    return { ok: false, error: "Form sudah ditutup." };

  if (form.one_response_per_user) {
    const { data: existing } = await supabase
      .from("form_responses")
      .select("id")
      .eq("form_id", formId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) {
      if (!form.allow_edit_response) return { ok: false, error: "Anda sudah mengisi form ini." };
      const { error } = await supabase
        .from("form_responses")
        .update({ answers })
        .eq("id", existing.id);
      return error ? { ok: false, error: error.message } : { ok: true };
    }
  }

  const { error } = await supabase
    .from("form_responses")
    .insert({ form_id: formId, user_id: user.id, answers });
  return error ? { ok: false, error: error.message } : { ok: true };
}
