"use client";

import { useEffect, useState, useRef } from "react";
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
  const [animating, setAnimating] = useState(false);
  const prevFavorited = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favorited = mounted && isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only animate when adding to favorites
    if (!favorited) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
    }

    toggleFavorite(productId);
  };

  // Track previous state for animation
  useEffect(() => {
    prevFavorited.current = favorited;
  }, [favorited]);

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
      <Heart
        className={cn(
          "w-5 h-5 transition-transform",
          favorited && "fill-current",
          animating && "animate-heart"
        )}
      />
      {showText && (
        <span className="ml-2">
          {favorited ? "お気に入り登録済み" : "お気に入りに追加"}
        </span>
      )}
    </button>
  );
}
