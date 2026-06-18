"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBrowserSupabase } from "@/shared/lib/supabase-browser";
import { useConfirm } from "./confirm-provider";
import {
  Bold,
  Heading2,
  Heading3,
  ImageUp,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Pilcrow,
  Quote,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Tool = { icon: LucideIcon; label: string; command: string; value?: string; prompt?: string };

const TOOLS: Tool[] = [
  { icon: Pilcrow, label: "Paragraf", command: "formatBlock", value: "p" },
  { icon: Heading2, label: "Judul", command: "formatBlock", value: "h2" },
  { icon: Heading3, label: "Subjudul", command: "formatBlock", value: "h3" },
  { icon: Bold, label: "Tebal", command: "bold" },
  { icon: Italic, label: "Miring", command: "italic" },
  { icon: List, label: "Daftar", command: "insertUnorderedList" },
  { icon: ListOrdered, label: "Daftar bernomor", command: "insertOrderedList" },
  { icon: Quote, label: "Kutipan", command: "formatBlock", value: "blockquote" },
  { icon: Link2, label: "Tautan", command: "createLink", prompt: "Masukkan URL tautan:" },
];

/**
 * Editor teks sederhana (WYSIWYG) berbasis contentEditable.
 * Pengguna cukup mengetik & memformat lewat toolbar — tidak perlu menulis HTML.
 * Output HTML disimpan ke <input hidden name={name}> agar ikut terkirim form.
 */
export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "Tulis konten di sini...",
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const { prompt } = useConfirm();
  const ref = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(defaultValue);
  const [empty, setEmpty] = useState(!defaultValue);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = defaultValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sync() {
    const el = ref.current;
    if (!el) return;
    setHtml(el.innerHTML);
    setEmpty(el.textContent?.trim() === "" && !el.querySelector("img,li"));
  }

  async function runTool(tool: Tool) {
    ref.current?.focus();
    let value = tool.value;
    if (tool.prompt) {
      // Simpan seleksi sebelum dialog mengambil fokus (agar createLink tetap kena teks terpilih).
      const sel = window.getSelection();
      const range = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
      const input = await prompt({ title: "Tambah Tautan", label: tool.prompt, placeholder: "https://..." });
      if (!input) return;
      value = input;
      ref.current?.focus();
      if (range && sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    document.execCommand(tool.command, false, value);
    sync();
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) return toast.error("File harus berupa gambar.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Ukuran maksimal 5MB.");
    const supabase = getBrowserSupabase();
    if (!supabase) return toast.error("Supabase belum dikonfigurasi.");

    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    // eslint-disable-next-line react-hooks/purity -- nama file acak hanya saat unggah (event), bukan render
    const path = `konten/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("news")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      setUploading(false);
      return toast.error("Gagal mengunggah: " + error.message);
    }
    const { data } = supabase.storage.from("news").getPublicUrl(path);
    ref.current?.focus();
    document.execCommand("insertImage", false, data.publicUrl);
    sync();
    setUploading(false);
    toast.success("Gambar disisipkan.");
  }

  return (
    <div className="border-input rounded-md border">
      <div className="bg-muted/40 flex flex-wrap gap-0.5 border-b p-1">
        {TOOLS.map((t) => (
          <Button
            key={t.label}
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            title={t.label}
            aria-label={t.label}
            onMouseDown={(e) => {
              e.preventDefault();
              runTool(t);
            }}
          >
            <t.icon className="size-4" />
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          title="Sisipkan Gambar"
          aria-label="Sisipkan Gambar"
          disabled={uploading}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => imageInputRef.current?.click()}
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImageUp className="size-4" />}
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void uploadImage(file);
          }}
        />
      </div>
      <div className="relative">
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onBlur={sync}
          role="textbox"
          aria-multiline="true"
          className={cn(
            "prose prose-sm prose-neutral dark:prose-invert min-h-56 max-w-none px-3 py-2.5 focus:outline-none",
          )}
        />
        {empty ? (
          <p className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 text-sm">
            {placeholder}
          </p>
        ) : null}
      </div>
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
