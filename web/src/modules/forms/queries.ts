import { getSupabase } from "@/shared/lib/supabase";
import type { DynamicForm, FormQuestion } from "./types";

/** Form aktif & belum lewat deadline yang ditandai tampil di beranda. */
export async function getActiveHomeForms(): Promise<DynamicForm[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("is_active", true)
    .eq("show_on_home", true)
    .gt("deadline_at", nowIso)
    .order("deadline_at", { ascending: true });
  if (error) return [];
  return (data as DynamicForm[]) ?? [];
}

export async function getPublicForm(
  slug: string,
): Promise<(DynamicForm & { questions: FormQuestion[] }) | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("forms")
    .select("*, questions:form_questions(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  const form = data as DynamicForm & { questions: FormQuestion[] };
  return { ...form, questions: [...(form.questions ?? [])].sort((a, b) => a.sort_order - b.sort_order) };
}
