import { prisma } from "@/lib/prisma";
import { BrandForm } from "@/components/admin/brand-form";
import { BrandList } from "@/components/admin/brand-list";

export const metadata = {
  title: "ブランド管理",
};

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ブランド管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4">新規ブランド追加</h2>
            <BrandForm />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <BrandList brands={brands} />
          </div>
        </div>
      </div>
    </div>
  );
}
