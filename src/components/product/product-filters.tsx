"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category, Brand } from "@/types/product";

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  currentCategory?: string;
  currentBrand?: string;
  currentSort?: string;
}

export function ProductFilters({
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentSort,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
          並び替え
        </h3>
        <select
          value={currentSort || "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 bg-white text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
        >
          <option value="newest">新着順</option>
          <option value="price-asc">価格が安い順</option>
          <option value="price-desc">価格が高い順</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
          カテゴリー
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => updateFilter("category", null)}
              className={`text-sm hover:text-amber-600 transition-colors ${
                !currentCategory ? "font-bold text-amber-600" : "text-gray-600"
              }`}
            >
              すべて
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => updateFilter("category", category.slug)}
                className={`text-sm hover:text-amber-600 transition-colors ${
                  currentCategory === category.slug
                    ? "font-bold text-amber-600"
                    : "text-gray-600"
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
          ブランド
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => updateFilter("brand", null)}
              className={`text-sm hover:text-amber-600 transition-colors ${
                !currentBrand ? "font-bold text-amber-600" : "text-gray-600"
              }`}
            >
              すべて
            </button>
          </li>
          {brands.map((brand) => (
            <li key={brand.id}>
              <button
                onClick={() => updateFilter("brand", brand.slug)}
                className={`text-sm hover:text-amber-600 transition-colors ${
                  currentBrand === brand.slug
                    ? "font-bold text-amber-600"
                    : "text-gray-600"
                }`}
              >
                {brand.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Clear Filters */}
      {(currentCategory || currentBrand) && (
        <button
          onClick={() => router.push("/products")}
          className="text-sm text-gray-500 hover:text-black underline"
        >
          フィルターをクリア
        </button>
      )}
    </div>
  );
}
