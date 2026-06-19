import { revalidatePath } from "next/cache";

/**
 * Prefix struktur file route untuk semua halaman publik:
 * `app/[locale]/(public)/...`. revalidatePath bekerja berdasarkan struktur
 * file route (bukan URL), jadi segmen dinamis `[locale]` dan route group
 * `(public)` WAJIB disertakan agar cache cocok. Lihat:
 * https://nextjs.org/docs/app/api-reference/functions/revalidatePath
 */
const PUBLIC_PREFIX = "/[locale]/(public)";

/**
 * Revalidasi halaman PUBLIK yang berada di `app/[locale]/(public)/...`.
 *
 * Masalah: `revalidatePath("/berita")` dengan path literal TIDAK cocok dengan
 * route file `app/[locale]/(public)/berita/page.tsx`, sehingga cache halaman
 * statis tidak pernah di-invalidate dan perubahan dari dashboard tidak muncul.
 *
 * Solusi: cocokkan berdasarkan struktur file route penuh (`[locale]` + route
 * group `(public)`) dengan tipe `"page"`, sehingga semua varian locale ikut
 * di-revalidate.
 *
 * @param routes Pola route TANPA prefix locale/route-group. Untuk route dinamis
 *   gunakan pola-nya, mis. `"/berita/[slug]"`, bukan slug konkret. Gunakan `"/"`
 *   untuk beranda.
 *
 * @example
 * revalidatePublic("/", "/berita", "/berita/[slug]");
 */
export function revalidatePublic(...routes: string[]) {
  for (const route of routes) {
    const clean = route === "/" ? "" : `/${route.replace(/^\/+|\/+$/g, "")}`;
    revalidatePath(`${PUBLIC_PREFIX}${clean}`, "page");
  }
}
