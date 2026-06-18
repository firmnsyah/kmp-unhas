"use client";

import { Button } from "@/components/ui/button";
import { getBrowserSupabase } from "@/shared/lib/supabase-browser";
import { ImageUp, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MAX_MB = 5;

/**
 * Unggah gambar ke Supabase Storage lalu simpan URL publiknya ke
 * <input hidden name={name}>. Menggantikan input URL manual.
 */
export function ImageUpload({
  name,
  defaultValue = "",
  bucket = "news",
}: {
  name: string;
  defaultValue?: string | null;
  bucket?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // izinkan pilih file sama lagi
    if (!file) return;

    if (!file.type.startsWith("image/")) return toast.error("File harus berupa gambar.");
    if (file.size > MAX_MB * 1024 * 1024) return toast.error(`Ukuran maksimal ${MAX_MB}MB.`);

    const supabase = getBrowserSupabase();
    if (!supabase) return toast.error("Supabase belum dikonfigurasi.");

    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      toast.error("Gagal mengunggah: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
    toast.success("Gambar diunggah.");
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau admin, tanpa optimizer */}
          <img src={url} alt="Pratinjau gambar" className="absolute inset-0 size-full object-cover" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setUrl("")}
            aria-label="Hapus gambar"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}

      <label className="border-input hover:bg-accent flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-sm transition-colors">
        <input type="file" accept="image/*" className="hidden" onChange={onChange} disabled={uploading} />
        {uploading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Mengunggah...
          </>
        ) : (
          <>
            <ImageUp className="size-4" /> {url ? "Ganti Gambar" : "Pilih & Unggah Gambar"}
          </>
        )}
      </label>
      <p className="text-muted-foreground text-xs">Format gambar, maks {MAX_MB}MB.</p>
    </div>
  );
}
