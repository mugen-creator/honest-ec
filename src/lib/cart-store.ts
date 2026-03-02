"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  addedAt: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const { items } = get();
        // 高級品は1点物なので、同じ商品は追加しない
        if (items.some((item) => item.product.id === product.id)) {
          return;
        }
        set({
          items: [...items, { product, addedAt: new Date().toISOString() }],
        });
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.product.price, 0);
      },

      getItemCount: () => {
        return get().items.length;
      },

      isInCart: (productId: string) => {
        return get().items.some((item) => item.product.id === productId);
      },
    }),
    {
      name: "honest-maison-cart",
    }
  )
);
