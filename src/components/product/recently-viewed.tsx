"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRecentlyViewedStore } from "@/lib/recently-viewed-store";
import { formatPrice } from "@/lib/utils";

interface RecentlyViewedProps {
  excludeId?: string;
  maxItems?: number;
}

export function RecentlyViewed({ excludeId, maxItems = 4 }: RecentlyViewedProps) {
  const products = useRecentlyViewedStore((state) => state.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredProducts = products
    .filter((p) => p.id !== excludeId)
    .slice(0, maxItems);

  if (filteredProducts.length === 0) return null;

  return (
    <section className="mt-16 lg:mt-24">
      <h2 className="font-serif-jp text-xl lg:text-2xl font-medium mb-8 tracking-wide">
        最近チェックした商品
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="relative aspect-square bg-gray-100 mb-3 overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <p className="text-xs text-amber-600 font-medium">{product.brandName}</p>
            <p className="text-sm font-medium line-clamp-2 group-hover:text-amber-600 transition-colors">
              {product.name}
            </p>
            <p className="text-sm font-bold mt-1">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
