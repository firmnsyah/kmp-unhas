"use server";

import { getServerSupabase } from "@/shared/lib/supabase-server";
import { revalidatePath } from "next/cache";
import type { RegistrationStatus } from "./queries";

export async function setRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, error: "Database belum dikonfigurasi." };
  const { error } = await supabase.from("registrations").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/pendaftar");
  return { ok: true };
}
