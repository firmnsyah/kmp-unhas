"use server";

import { getSupabase } from "@/shared/lib/supabase";
import { contactSchema, type ContactInput } from "./schema";

export type ContactResult =
  | { ok: true }
  | { ok: false; error: "validation" | "unconfigured" | "server" };

export async function submitContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation" };
  if (parsed.data.website) return { ok: true }; // honeypot

  const db = getSupabase();
  if (!db) return { ok: false, error: "unconfigured" };

  const { website: _website, ...fields } = parsed.data;
  const { error } = await db.from("contact_messages").insert(fields);
  if (error) {
    console.error("submitContactMessage:", error.message);
    return { ok: false, error: "server" };
  }
  return { ok: true };
}

export async function setMessageRead(
  id: string,
  isRead: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const { getServerSupabase } = await import("@/shared/lib/supabase-server");
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/dashboard/pesan");
  return { ok: true };
}
