import { siteConfig } from "@/shared/config/site";
import { ImageResponse } from "next/og";

export const alt = "KMP-UNHAS|Kerukunan Mahasiswa Pinrang Universitas Hasanuddin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG image default bertema merah→biru (PRD §10) untuk halaman tanpa gambar.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #dc2626, #1d4ed8)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "rgba(255,255,255,0.18)",
            fontSize: 72,
            fontWeight: 800,
            marginBottom: 32,
          }}
        >
          K
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 30, opacity: 0.9, marginTop: 12, textAlign: "center", maxWidth: 900 }}>
          {siteConfig.fullName}
        </div>
      </div>
    ),
    size,
  );
}
