import { listRegistrations, RegistrationTable } from "@/modules/registrations";

export const dynamic = "force-dynamic";

export default async function PendaftarPage() {
  const rows = await listRegistrations();
  return (
    <RegistrationTable
      rows={rows}
      title="Pendaftar Anggota"
      description="Kelola pendaftar anggota baru dan unduh datanya."
    />
  );
}
