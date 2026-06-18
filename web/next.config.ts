import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Optimizer dimatikan: gambar (lokal & Supabase Storage publik) dimuat langsung
    // via <img>. Supabase image-transform butuh plan berbayar, jadi tak dipakai.
    // Trade-off: tanpa AVIF/WebP otomatis — bisa ditambah loader khusus nanti.
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
