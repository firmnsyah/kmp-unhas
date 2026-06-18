import type { Localized } from "@/shared/lib/types";

export type QuestionType =
  | "short_text"
  | "long_text"
  | "number"
  | "email"
  | "phone"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "date"
  | "image_single"
  | "image_multiple"
  | "file";

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  short_text: "Teks Singkat",
  long_text: "Teks Panjang",
  number: "Angka",
  email: "Email",
  phone: "No. HP",
  radio: "Pilihan Ganda",
  checkbox: "Kotak Centang",
  dropdown: "Dropdown",
  date: "Tanggal",
  image_single: "Upload Gambar (1 foto)",
  image_multiple: "Upload Gambar (banyak foto)",
  file: "Upload File",
};

export type FormQuestion = {
  id: string;
  label: Localized;
  type: QuestionType;
  options: string[] | null;
  is_required: boolean;
  sort_order: number;
};

export type DynamicForm = {
  id: string;
  title: Localized;
  slug: string;
  description: Localized | null;
  banner_url: string | null;
  deadline_at: string;
  is_active: boolean;
  show_on_home: boolean;
  one_response_per_user: boolean;
  allow_edit_response: boolean;
};

export type FormResponse = {
  id: string;
  user_id: string;
  answers: Record<string, unknown>;
  created_at: string;
  author_name: string | null;
};
