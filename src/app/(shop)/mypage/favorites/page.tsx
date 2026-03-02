"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useFavoritesStore } from "@/lib/favorites-store";
import { mockProducts } from "@/lib/mock-data";
import { ProductGrid } from "@/components/product/product-grid";

export default function FavoritesPage() {
  const { favoriteIds } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteProducts = mounted
    ? mockProducts.filter((p) => favoriteIds.includes(p.id))
    : [];

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

      {!mounted ? (
        <div className="text-center py-16">
          <div className="animate-pulse">読み込み中...</div>
        </div>
      ) : favoriteProducts.length === 0 ? (
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
        <ProductGrid products={favoriteProducts} />
      )}
    </div>
  );
}
