import Link from "next/link";
import Image from "next/image";
import { Product, conditionColors } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";

interface ProductCardProps {
  product: Product;
  rank?: number;
}

export function ProductCard({ product, rank }: ProductCardProps) {
  const mainImage = product.images[0];

  return (
    <article className="group">
      <Link href={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
          {/* Rank Badge */}
          {rank && (
            <span className={cn(
              "absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full",
              rank === 1 ? "bg-cyan-400 text-white" :
              rank === 2 ? "bg-gray-300 text-gray-700" :
              rank === 3 ? "bg-cyan-600 text-white" :
              "bg-black text-white"
            )}>
              {rank}
            </span>
          )}
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ viewTransitionName: `product-${product.id}` }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Condition Badge */}
          {!rank && (
            <span
              className={cn(
                "absolute top-3 left-3 px-2 py-1 text-xs font-medium",
                conditionColors[product.condition]
              )}
            >
              {product.condition === "NEW" ? "新品" : `${product.condition}ランク`}
            </span>
          )}

          {/* Favorite Button */}
          <div className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
            <FavoriteButton productId={product.id} />
          </div>

          {/* Sold Out Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2">
          <p className="text-xs text-cyan-600 font-medium">{product.brand.name}</p>
          <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-cyan-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-lg font-bold">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
