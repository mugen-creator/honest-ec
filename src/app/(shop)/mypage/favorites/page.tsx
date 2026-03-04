"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useFavoritesStore } from "@/lib/favorites-store";
import { ProductGrid } from "@/components/product/product-grid";
import { Product } from "@/types/product";

export default function FavoritesPage() {
  const { favoriteIds } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchFavorites = async () => {
      if (favoriteIds.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/products/by-ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: favoriteIds }),
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Favorites fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [mounted, favoriteIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Back Link */}
      <Link
        href="/mypage"
        className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        マイページに戻る
      </Link>

      <h1 className="text-2xl font-bold mb-8">お気に入り</h1>

      {!mounted || isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50">
          <p className="text-gray-500 mb-4">お気に入りに登録した商品がありません</p>
          <Link
            href="/products"
            className="text-amber-600 hover:underline font-medium"
          >
            商品を見る →
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
