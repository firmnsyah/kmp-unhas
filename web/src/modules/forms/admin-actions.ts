"use server";

import { logActivity } from "@/shared/lib/activity";
import { getAdminContext, isAdminRole } from "@/shared/lib/admin-guard";
import { slugify } from "@/shared/lib/slug";
import { revalidatePath } from "next/cache";

export type FormResult = { ok: boolean; error?: string; id?: string };

function revalidateForms(slug?: string) {
  revalidatePath("/dashboard/form");
  revalidatePath("/");
  if (slug) revalidatePath(`/form/${slug}`);
}

export async function saveForm(formData: FormData): Promise<FormResult> {
  const { supabase, role, userId } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const bannerUrl = String(formData.get("banner_url") ?? "").trim() || null;
  const deadline = String(formData.get("deadline_at") ?? "");
  const isActive = formData.get("is_active") === "on";
  const showOnHome = formData.get("show_on_home") === "on";
  const onePerUser = formData.get("one_response_per_user") === "on";
  const allowEdit = formData.get("allow_edit_response") === "on";
  if (!title || !deadline) return { ok: false, error: "Judul dan deadline wajib diisi." };

  const payload: Record<string, unknown> = {
    title: { id: title },
    description: description ? { id: description } : null,
    banner_url: bannerUrl,
    deadline_at: new Date(deadline).toISOString(),
    is_active: isActive,
    show_on_home: showOnHome,
    one_response_per_user: onePerUser,
    allow_edit_response: allowEdit,
  };

  if (id) {
    const { data, error } = await supabase.from("forms").update(payload).eq("id", id).select("slug").single();
    if (error) return { ok: false, error: error.message };
    await logActivity("form.update", "forms", id);
    revalidateForms(data?.slug);
    return { ok: true, id };
  }
  payload.slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`;
  payload.created_by = userId;
  const { data, error } = await supabase.from("forms").insert(payload).select("id").single();
  if (error) return { ok: false, error: error.message };
  await logActivity("form.create", "forms", data?.id);
  revalidateForms();
  return { ok: true, id: data?.id };
}

export async function deleteForm(id: string): Promise<FormResult> {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };
  const { error } = await supabase.from("forms").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("form.delete", "forms", id);
  revalidateForms();
  return { ok: true };
}

export async function saveQuestion(formData: FormData): Promise<FormResult> {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };

  const id = String(formData.get("id") ?? "");
  const formId = String(formData.get("form_id") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const type = String(formData.get("type") ?? "short_text");
  const required = formData.get("is_required") === "on";
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  const optionsRaw = String(formData.get("options") ?? "");
  const options = ["radio", "checkbox", "dropdown"].includes(type)
    ? optionsRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : null;
  if (!formId || !label) return { ok: false, error: "Label pertanyaan wajib diisi." };

  const payload = { form_id: formId, label: { id: label }, type, options, is_required: required, sort_order: sortOrder };
  const res = id
    ? await supabase.from("form_questions").update(payload).eq("id", id)
    : await supabase.from("form_questions").insert(payload);
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/form/${formId}`);
  return { ok: true };
}

export async function deleteQuestion(id: string, formId: string): Promise<FormResult> {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };
  const { error } = await supabase.from("form_questions").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/form/${formId}`);
  return { ok: true };
}
