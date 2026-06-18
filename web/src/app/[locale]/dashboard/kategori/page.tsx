import { CategoryManager, getCategories } from "@/modules/news";

export const dynamic = "force-dynamic";

export default async function KategoriPage() {
  const categories = await getCategories();
  return (
    <CategoryManager
      categories={categories}
      title="Kategori Berita"
      description="Kelola kategori untuk berita."
    />
  );
}
