import { siteConfig } from "@/shared/config/site";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.fullName}`,
    short_name: siteConfig.name,
    description:
      "Website resmi Kerukunan Mahasiswa Pinrang Universitas Hasanuddin.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    icons: [
      { src: "/images/logo.png", sizes: "300x300", type: "image/png", purpose: "any" },
    ],
  };
}
