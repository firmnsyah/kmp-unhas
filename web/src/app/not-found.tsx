import Link from "next/link";
import "./globals.css";

// Fallback global (di luar locale). Karena tidak ada root layout selain
// [locale]/layout.tsx, halaman ini menyediakan struktur html sendiri.
export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body className="font-sans">
        <div className="flex min-h-svh flex-col items-center justify-center px-4 py-16 text-center">
          <p className="text-primary text-7xl font-extrabold">404</p>
          <h1 className="mt-4 text-2xl font-bold">Halaman Tidak Ditemukan</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>
          <Link
            href="/"
            className="bg-primary text-primary-foreground mt-6 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </body>
    </html>
  );
}
