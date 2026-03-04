import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "カテゴリー一覧",
  description: "Honest-Maisonの商品カテゴリー一覧です。",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          products: {
            where: { isPublished: true },
          },
        },
      },
    },
  });

  // 商品があるカテゴリのみ表示
  const categoriesWithProducts = categories.filter((c) => c._count.products > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif-jp text-2xl lg:text-3xl font-medium tracking-wide mb-2">カテゴリー一覧</h1>
        <p className="text-gray-600">
          お探しの商品カテゴリーをお選びください
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesWithProducts.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group relative border border-gray-200 p-8 hover:border-black transition-colors"
          >
            <h2 className="font-serif-jp font-medium text-xl tracking-wide group-hover:text-amber-600 transition-colors">
              {category.name}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {category._count.products}点の商品
            </p>
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-gray-300 group-hover:text-amber-600 transition-colors">
              →
            </span>
          </Link>
        ))}
      </div>

      {categoriesWithProducts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          現在カテゴリーはありません
        </div>
      )}
    </div>
  );
}
