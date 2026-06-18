"use server";

import { getSupabase } from "@/shared/lib/supabase";
import { registrationSchema, type RegistrationInput } from "./schema";

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: "validation" | "unconfigured" | "server" };

export async function submitRegistration(input: RegistrationInput): Promise<SubmitResult> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation" };

  // Honeypot terisi → perlakukan seolah sukses tanpa menyimpan (membingungkan bot)
  if (parsed.data.website) return { ok: true };

  const db = getSupabase();
  if (!db) return { ok: false, error: "unconfigured" };

  const { website: _website, consent, ...fields } = parsed.data;
  const { error } = await db.from("registrations").insert({ ...fields, consent });
  if (error) {
    console.error("submitRegistration:", error.message);
    return { ok: false, error: "server" };
  }
  return { ok: true };
}
