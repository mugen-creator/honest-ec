import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "ブランド一覧",
  description: "Honest-Maisonで取り扱いのあるブランド一覧です。",
};

export const revalidate = 60; // 60秒キャッシュ

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
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

  // 商品があるブランドのみ表示
  const brandsWithProducts = brands.filter((b) => b._count.products > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif-jp text-2xl lg:text-3xl font-medium tracking-wide mb-2">ブランド一覧</h1>
        <p className="text-gray-600">
          {brandsWithProducts.length}ブランドの取り扱いがあります
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brandsWithProducts.map((brand) => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.slug}`}
            className="group border border-gray-200 p-6 hover:border-black transition-colors"
          >
            <h2 className="font-serif-jp font-medium text-lg tracking-wide group-hover:text-amber-600 transition-colors">
              {brand.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {brand._count.products}点
            </p>
          </Link>
        ))}
      </div>

      {brandsWithProducts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          現在取り扱いブランドはありません
        </div>
      )}
    </div>
  );
}
