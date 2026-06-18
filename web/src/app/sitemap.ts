import { getDepartments } from "@/modules/organization";
import { getAlbums } from "@/modules/gallery";
import { getLatestNews } from "@/modules/news";
import { siteConfig } from "@/shared/config/site";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticPaths = [
    "",
    "/tentang/sejarah",
    "/tentang/visi-misi",
    "/tentang/logo",
    "/tentang/mars",
    "/tentang/pimpinan",
    "/tentang/dewan-pembina",
    "/tentang/dewan-pertimbangan",
    "/tentang/struktur-kepengurusan",
    "/tentang/departemen",
    "/berita",
    "/galeri",
    "/agenda",
    "/pendaftaran",
    "/kontak",
    "/privasi",
  ];

  const [news, departments, albums] = await Promise.all([
    getLatestNews(50),
    getDepartments(),
    getAlbums(),
  ]);

  const dynamicPaths = [
    ...news.map((n) => `/berita/${n.slug}`),
    ...departments.map((d) => `/tentang/departemen/${d.slug}`),
    ...albums.map((a) => `/galeri/${a.slug}`),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
