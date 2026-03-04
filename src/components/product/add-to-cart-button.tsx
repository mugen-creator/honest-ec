"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useFavoritesStore } from "@/lib/favorites-store";
import { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem, isInCart } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [isAdded, setIsAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inCart = mounted && isInCart(product.id);
  const favorited = mounted && isFavorite(product.id);

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  return (
    <div className="space-y-3">
      {inCart ? (
        <Button
          onClick={handleGoToCart}
          className="w-full bg-amber-600 hover:bg-amber-700"
          size="lg"
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          購入手続きへ進む
        </Button>
      ) : (
        <Button
          onClick={handleAddToCart}
          className="w-full"
          size="lg"
        >
          {isAdded ? (
            "カートに追加しました！"
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 mr-2" />
              カートに入れる
            </>
          )}
        </Button>
      )}

      <Button
        onClick={handleToggleFavorite}
        variant="outline"
        className="w-full"
        size="lg"
      >
        <Heart className={`w-5 h-5 mr-2 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
        {favorited ? "お気に入り登録済み" : "お気に入りに追加"}
      </Button>
    </div>
  );
}
