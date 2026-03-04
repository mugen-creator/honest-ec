import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/product-grid";

export const metadata = {
  title: "人気ランキング",
  description: "Honest-Maisonの人気商品ランキングです。",
};

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  // 注文数が多い順に商品を取得
  const productsWithOrderCount = await prisma.product.findMany({
    where: {
      isPublished: true,
    },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      _count: {
        select: { orderItems: true },
      },
    },
  });

  // 注文数でソート
  const products = productsWithOrderCount
    .sort((a, b) => b._count.orderItems - a._count.orderItems)
    .slice(0, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif-jp text-2xl lg:text-3xl font-medium tracking-wide mb-2">人気ランキング</h1>
        <p className="text-gray-600">
          売れ筋商品をチェック
        </p>
      </div>

      {/* Ranking Grid */}
      <ProductGrid products={products} showRank />
    </div>
  );
}
