export type ProductCondition = "NEW" | "S" | "A" | "B" | "C";

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  condition: ProductCondition;
  serialNumber: string | null;
  certificate: string | null;
  stock: number;
  isPublished: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export const conditionLabels: Record<ProductCondition, string> = {
  NEW: "新品",
  S: "S (未使用に近い)",
  A: "A (目立った傷や汚れなし)",
  B: "B (やや傷や汚れあり)",
  C: "C (傷や汚れあり)",
};

export const conditionColors: Record<ProductCondition, string> = {
  NEW: "condition-new",
  S: "condition-s",
  A: "condition-a",
  B: "condition-b",
  C: "condition-c",
};
