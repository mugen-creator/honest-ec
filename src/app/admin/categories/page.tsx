import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryList } from "@/components/admin/category-list";

export const metadata = {
  title: "カテゴリー管理",
};

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">カテゴリー管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4">新規カテゴリー追加</h2>
            <CategoryForm />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <CategoryList categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
