import { Product } from "@/types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  showRank?: boolean;
}

export function ProductGrid({ products, emptyMessage = "商品がありません", showRank = false }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} rank={showRank ? index + 1 : undefined} />
      ))}
    </div>
  );
}
