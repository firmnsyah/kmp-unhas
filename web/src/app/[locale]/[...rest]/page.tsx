import { notFound } from "next/navigation";

// Tangkap path tak dikenal di dalam locale → tampilkan 404 terlokalisasi.
export default function CatchAllPage() {
  notFound();
}
