/**
 * Ubah URL YouTube (format watch, youtu.be, atau embed) menjadi URL embed
 * privacy-friendly (youtube-nocookie). Mengembalikan null jika bukan URL YouTube valid.
 */
export function toYouTubeEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
  );
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}
