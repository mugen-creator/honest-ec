"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/lib/recently-viewed-store";

interface TrackViewProps {
  product: {
    id: string;
    name: string;
    price: number;
    brand: { name: string };
    images: { url: string }[];
  };
}

export function TrackView({ product }: TrackViewProps) {
  const addProduct = useRecentlyViewedStore((state) => state.addProduct);

  useEffect(() => {
    addProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      brandName: product.brand.name,
      imageUrl: product.images[0]?.url || null,
    });
  }, [product, addProduct]);

  return null;
}
