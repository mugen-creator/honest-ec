"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/lib/favorites-store";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({
  productId,
  className,
  showText = false,
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favorited = mounted && isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "transition-colors",
        favorited ? "text-red-500" : "text-gray-400 hover:text-red-500",
        className
      )}
      aria-label={favorited ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <Heart className={cn("w-5 h-5", favorited && "fill-current")} />
      {showText && (
        <span className="ml-2">
          {favorited ? "お気に入り登録済み" : "お気に入りに追加"}
        </span>
      )}
    </button>
  );
}
