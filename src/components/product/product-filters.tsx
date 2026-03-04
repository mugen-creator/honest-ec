"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Category, Brand } from "@/types/product";
import { cn } from "@/lib/utils";

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
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const activeFiltersCount = (currentCategory ? 1 : 0) + (currentBrand ? 1 : 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center justify-center gap-2 w-full py-3 border border-gray-300 text-sm font-medium mb-4"
      >
        <SlidersHorizontal className="w-4 h-4" />
        フィルター
        {activeFiltersCount > 0 && (
          <span className="bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white transform transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-bold">フィルター</h2>
            <button onClick={() => setIsOpen(false)} className="p-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            <FilterContent
              categories={categories}
              brands={brands}
              currentCategory={currentCategory}
              currentBrand={currentBrand}
              currentSort={currentSort}
              updateFilter={updateFilter}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-8">
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
    </>
  );
}

// Shared filter content component
function FilterContent({
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentSort,
  updateFilter,
  onClose,
}: {
  categories: Category[];
  brands: Brand[];
  currentCategory?: string;
  currentBrand?: string;
  currentSort?: string;
  updateFilter: (key: string, value: string | null) => void;
  onClose?: () => void;
}) {
  const router = useRouter();

  const handleFilter = (key: string, value: string | null) => {
    updateFilter(key, value);
    onClose?.();
  };

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
          並び替え
        </h3>
        <select
          value={currentSort || "newest"}
          onChange={(e) => handleFilter("sort", e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 bg-white text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
        >
          <option value="newest">新着順</option>
          <option value="price-asc">価格が安い順</option>
          <option value="price-desc">価格が高い順</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
          カテゴリー
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleFilter("category", null)}
              className={cn(
                "text-sm transition-colors",
                !currentCategory ? "font-bold text-amber-600" : "text-gray-600 hover:text-amber-600"
              )}
            >
              すべて
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleFilter("category", category.slug)}
                className={cn(
                  "text-sm transition-colors",
                  currentCategory === category.slug
                    ? "font-bold text-amber-600"
                    : "text-gray-600 hover:text-amber-600"
                )}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
          ブランド
        </h3>
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          <li>
            <button
              onClick={() => handleFilter("brand", null)}
              className={cn(
                "text-sm transition-colors",
                !currentBrand ? "font-bold text-amber-600" : "text-gray-600 hover:text-amber-600"
              )}
            >
              すべて
            </button>
          </li>
          {brands.map((brand) => (
            <li key={brand.id}>
              <button
                onClick={() => handleFilter("brand", brand.slug)}
                className={cn(
                  "text-sm transition-colors",
                  currentBrand === brand.slug
                    ? "font-bold text-amber-600"
                    : "text-gray-600 hover:text-amber-600"
                )}
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
          onClick={() => {
            router.push("/products");
            onClose?.();
          }}
          className="w-full py-2 text-sm text-gray-500 hover:text-black border border-gray-300 transition-colors"
        >
          フィルターをクリア
        </button>
      )}
    </div>
  );
}
