import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
    sort?: string;
    search?: string;
  }>;
}

export const metadata = {
  title: "商品一覧",
  description: "Honest-Maisonの商品一覧ページです。高級時計、ブランドバッグ、アクセサリーを取り揃えております。",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // カテゴリとブランドを取得
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  // フィルター条件を構築
  const where: Record<string, unknown> = {
    isPublished: true,
  };

  if (params.category) {
    const category = categories.find((c) => c.slug === params.category);
    if (category) {
      where.categoryId = category.id;
    }
  }

  if (params.brand) {
    const brand = brands.find((b) => b.slug === params.brand);
    if (brand) {
      where.brandId = brand.id;
    }
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) {
      (where.price as Record<string, number>).gte = parseInt(params.minPrice);
    }
    if (params.maxPrice) {
      (where.price as Record<string, number>).lte = parseInt(params.maxPrice);
    }
  }

  if (params.condition) {
    const conditions = params.condition.split(",");
    where.condition = { in: conditions };
  }

  // 検索クエリ
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { brand: { name: { contains: params.search, mode: "insensitive" } } },
      { category: { name: { contains: params.search, mode: "insensitive" } } },
    ];
  }

  // ソート条件
  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (params.sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // 商品を取得
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  const categoryName = params.category
    ? categories.find((c) => c.slug === params.category)?.name
    : null;

  const brandName = params.brand
    ? brands.find((b) => b.slug === params.brand)?.name
    : null;

  const searchQuery = params.search || null;

  const pageTitle = searchQuery
    ? `「${searchQuery}」の検索結果`
    : categoryName || brandName || "全商品";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif-jp text-2xl lg:text-3xl font-medium mb-2 tracking-wide">{pageTitle}</h1>
        <p className="text-gray-600 tracking-wide">
          {products.length}件の商品が見つかりました
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Filters - Sidebar */}
        <aside className="lg:w-56 xl:w-64 flex-shrink-0">
          <Suspense fallback={<div className="animate-pulse h-8 bg-gray-100" />}>
            <ProductFilters
              categories={categories}
              brands={brands}
              currentCategory={params.category}
              currentBrand={params.brand}
              currentSort={params.sort}
            />
          </Suspense>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
