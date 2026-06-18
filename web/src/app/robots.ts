import { siteConfig } from "@/shared/config/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/dashboard", "/api"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
