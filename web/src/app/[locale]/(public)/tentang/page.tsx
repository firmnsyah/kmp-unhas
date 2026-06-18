import { redirect } from "next/navigation";

// "Tentang" adalah dropdown; akses langsung /tentang diarahkan ke sub-halaman pertama.
export default async function TentangPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(locale === "en" ? "/en/tentang/sejarah" : "/tentang/sejarah");
}
