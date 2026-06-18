import { FormListManager, getAdminForms } from "@/modules/forms";

export const dynamic = "force-dynamic";

export default async function FormDashboardPage() {
  const forms = await getAdminForms();
  return (
    <FormListManager
      forms={forms}
      title="Form Dinamis"
      description="Buat form, bagikan, dan kelola responsnya."
    />
  );
}
