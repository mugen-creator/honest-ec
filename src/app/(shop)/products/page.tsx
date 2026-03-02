import { Suspense } from "react";
import { mockProducts, categories, brands } from "@/lib/mock-data";
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
  }>;
}

export const metadata = {
  title: "商品一覧",
  description: "Honest-Maisonの商品一覧ページです。高級時計、ブランドバッグ、アクセサリーを取り揃えております。",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // フィルタリング処理
  let filteredProducts = mockProducts.filter((p) => p.isPublished);

  if (params.category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.slug === params.category
    );
  }

  if (params.brand) {
    filteredProducts = filteredProducts.filter(
      (p) => p.brand.slug === params.brand
    );
  }

  if (params.minPrice) {
    const minPrice = parseInt(params.minPrice);
    filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
  }

  if (params.maxPrice) {
    const maxPrice = parseInt(params.maxPrice);
    filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
  }

  if (params.condition) {
    const conditions = params.condition.split(",");
    filteredProducts = filteredProducts.filter((p) =>
      conditions.includes(p.condition)
    );
  }

  // ソート処理
  switch (params.sort) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      filteredProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }

  const categoryName = params.category
    ? categories.find((c) => c.slug === params.category)?.name
    : null;

  const brandName = params.brand
    ? brands.find((b) => b.slug === params.brand)?.name
    : null;

  const pageTitle = categoryName || brandName || "全商品";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">{pageTitle}</h1>
        <p className="text-gray-600">
          {filteredProducts.length}件の商品が見つかりました
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense fallback={<div>読み込み中...</div>}>
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
        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
