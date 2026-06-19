"use server";

import { logActivity } from "@/shared/lib/activity";
import { getAdminContext, isAdminRole } from "@/shared/lib/admin-guard";
import { revalidatePublic } from "@/shared/lib/revalidate";
import { revalidatePath } from "next/cache";

export type EventResult = { ok: boolean; error?: string };

function revalidateEvents() {
  revalidatePath("/dashboard/agenda");
  revalidatePublic("/", "/agenda");
}

export async function saveEvent(formData: FormData): Promise<EventResult> {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };

  const id = String(formData.get("id") ?? "");
  const titleId = String(formData.get("title_id") ?? "").trim();
  const descId = String(formData.get("description_id") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const startAt = String(formData.get("start_at") ?? "");
  const endAt = String(formData.get("end_at") ?? "") || null;
  const type = String(formData.get("type") ?? "non_proker");
  const departmentId = String(formData.get("department_id") ?? "") || null;
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "upcoming");

  if (!titleId || !startAt) return { ok: false, error: "Judul dan waktu mulai wajib diisi." };

  const payload = {
    title: { id: titleId },
    description: descId ? { id: descId } : null,
    location,
    start_at: new Date(startAt).toISOString(),
    end_at: endAt ? new Date(endAt).toISOString() : null,
    type,
    department_id: type === "proker" ? departmentId : null,
    image_url: imageUrl,
    status,
  };

  const res = id
    ? await supabase.from("events").update(payload).eq("id", id)
    : await supabase.from("events").insert(payload);
  if (res.error) return { ok: false, error: res.error.message };

  await logActivity(id ? "event.update" : "event.create", "events", id || undefined);
  revalidateEvents();
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<EventResult> {
  const { supabase, role } = await getAdminContext();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  if (!isAdminRole(role)) return { ok: false, error: "Tidak diizinkan." };

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity("event.delete", "events", id);
  revalidateEvents();
  return { ok: true };
}
