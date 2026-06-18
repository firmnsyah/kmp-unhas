import { getServerSupabase } from "@/shared/lib/supabase-server";
import type { DynamicForm, FormQuestion, FormResponse } from "./types";

export type FormListItem = DynamicForm & { response_count: number };

export async function getAdminForms(): Promise<FormListItem[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("forms")
    .select("*, responses:form_responses(count)")
    .order("created_at", { ascending: false });
  return ((data as (DynamicForm & { responses: { count: number }[] })[]) ?? []).map(
    ({ responses, ...f }) => ({ ...f, response_count: responses?.[0]?.count ?? 0 }),
  );
}

export async function getFormForEdit(
  id: string,
): Promise<(DynamicForm & { questions: FormQuestion[] }) | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("forms")
    .select("*, questions:form_questions(*)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const form = data as DynamicForm & { questions: FormQuestion[] };
  return { ...form, questions: [...form.questions].sort((a, b) => a.sort_order - b.sort_order) };
}

export async function getFormResponses(
  formId: string,
): Promise<{ form: (DynamicForm & { questions: FormQuestion[] }) | null; responses: FormResponse[] }> {
  const supabase = await getServerSupabase();
  if (!supabase) return { form: null, responses: [] };
  const form = await getFormForEdit(formId);
  const { data } = await supabase
    .from("form_responses")
    .select("id, user_id, answers, created_at, author:profiles(full_name)")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });
  type Raw = Omit<FormResponse, "author_name"> & { author: { full_name: string } | { full_name: string }[] | null };
  const responses = ((data as Raw[]) ?? []).map((r) => {
    const a = Array.isArray(r.author) ? r.author[0] : r.author;
    return { id: r.id, user_id: r.user_id, answers: r.answers, created_at: r.created_at, author_name: a?.full_name ?? null };
  });
  return { form, responses };
}
