"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStore {
  favoriteIds: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  getFavoriteCount: () => number;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (productId: string) => {
        const { favoriteIds } = get();
        if (!favoriteIds.includes(productId)) {
          set({ favoriteIds: [...favoriteIds, productId] });
        }
      },

      removeFavorite: (productId: string) => {
        set({
          favoriteIds: get().favoriteIds.filter((id) => id !== productId),
        });
      },

      toggleFavorite: (productId: string) => {
        const { favoriteIds, addFavorite, removeFavorite } = get();
        if (favoriteIds.includes(productId)) {
          removeFavorite(productId);
        } else {
          addFavorite(productId);
        }
      },

      isFavorite: (productId: string) => {
        return get().favoriteIds.includes(productId);
      },

      getFavoriteCount: () => {
        return get().favoriteIds.length;
      },
    }),
    {
      name: "honest-maison-favorites",
    }
  )
);
