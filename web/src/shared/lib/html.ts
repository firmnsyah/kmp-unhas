/**
 * Siapkan konten dari field "rich text" untuk dirender via dangerouslySetInnerHTML.
 *
 * - Jika nilai sudah berupa HTML (hasil RichTextEditor), pakai apa adanya.
 * - Jika masih teks polos (data lama sebelum migrasi ke rich text), escape karakter
 *   HTML dan ubah baris baru menjadi <br> agar format input tetap terjaga.
 *
 * Catatan: HTML hanya dihasilkan oleh editor di dashboard (akses admin tepercaya),
 * konsisten dengan render konten berita/sejarah/privasi yang sudah ada.
 */
export function richTextToHtml(value?: string | null): string {
  if (!value) return "";
  // Mengandung tag HTML → anggap sudah HTML.
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  // Teks polos: escape minimal lalu pertahankan baris baru.
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}
