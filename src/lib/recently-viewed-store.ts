import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentProduct {
  id: string;
  name: string;
  price: number;
  brandName: string;
  imageUrl: string | null;
  viewedAt: number;
}

interface RecentlyViewedStore {
  products: RecentProduct[];
  addProduct: (product: Omit<RecentProduct, "viewedAt">) => void;
  clearAll: () => void;
}

const MAX_ITEMS = 10;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => {
          // Remove if already exists
          const filtered = state.products.filter((p) => p.id !== product.id);
          // Add to beginning with timestamp
          const newProducts = [
            { ...product, viewedAt: Date.now() },
            ...filtered,
          ].slice(0, MAX_ITEMS);
          return { products: newProducts };
        }),
      clearAll: () => set({ products: [] }),
    }),
    {
      name: "recently-viewed",
    }
  )
);
