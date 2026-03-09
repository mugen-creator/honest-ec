import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Shield, Truck, RotateCcw, Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { conditionLabels } from "@/types/product";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { FavoriteButton } from "@/components/product/favorite-button";
import { ProductGrid } from "@/components/product/product-grid";
import { TrackView } from "@/components/product/track-view";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ShareButtons } from "@/components/product/share-buttons";
import { RestockNotifyForm } from "@/components/product/restock-notify-form";
import { ProductReviews } from "@/components/product/product-reviews";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 30; // 30秒キャッシュ

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return { title: "商品が見つかりません" };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // 関連商品（同じカテゴリの他の商品）
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      categoryId: product.categoryId,
      isPublished: true,
    },
    take: 4,
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-black flex-shrink-0">
          ホーム
        </Link>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <Link href="/products" className="hover:text-black flex-shrink-0 hidden sm:inline">
          商品一覧
        </Link>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 hidden sm:inline" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-black flex-shrink-0"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="text-black truncate max-w-[150px] sm:max-w-[250px]">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <ProductImageGallery images={product.images} productName={product.name} />

        {/* Info */}
        <div>
          {/* Brand */}
          <Link
            href={`/products?brand=${product.brand.slug}`}
            className="text-cyan-600 text-sm font-medium hover:underline"
          >
            {product.brand.name}
          </Link>

          {/* Name */}
          <h1 className="font-serif-jp text-2xl lg:text-3xl font-medium mt-2 mb-4 tracking-wide leading-relaxed">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-bold mb-6">{formatPrice(product.price)}</p>

          {/* Condition */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <span className="text-sm text-gray-500">商品状態</span>
            <span className="font-medium">{conditionLabels[product.condition] || product.condition}</span>
          </div>

          {/* Add to Cart & Favorite */}
          <div className="mb-8 space-y-3">
            {product.stock > 0 ? (
              <AddToCartButton product={product} />
            ) : (
              <div className="space-y-4">
                <div className="text-center py-4 bg-gray-100">
                  <span className="text-gray-500 font-medium">SOLD OUT</span>
                </div>
                <RestockNotifyForm productId={product.id} productName={product.name} />
              </div>
            )}
            <div className="flex justify-center">
              <FavoriteButton
                productId={product.id}
                showText
                className="flex items-center text-sm hover:text-red-500"
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pb-8 border-b">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-cyan-600" />
              <span className="text-sm">正規品保証</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-cyan-600" />
              <span className="text-sm">送料無料</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-cyan-600" />
              <span className="text-sm">返品対応</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h2 className="font-bold">商品詳細</h2>

            <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-gray-500">ブランド</dt>
              <dd>{product.brand.name}</dd>

              <dt className="text-gray-500">カテゴリー</dt>
              <dd>{product.category.name}</dd>

              <dt className="text-gray-500">状態</dt>
              <dd>{conditionLabels[product.condition] || product.condition}</dd>

              {product.serialNumber && (
                <>
                  <dt className="text-gray-500">シリアル</dt>
                  <dd>{product.serialNumber}</dd>
                </>
              )}

              {product.certificate && (
                <>
                  <dt className="text-gray-500">付属品・証明</dt>
                  <dd>{product.certificate}</dd>
                </>
              )}
            </dl>

            {/* Description */}
            <div className="pt-4">
              <h3 className="font-bold mb-2">商品説明</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-8 p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">
              この商品についてのお問い合わせ
            </p>
            <Link
              href={`/contact?product=${product.id}`}
              className="text-sm text-cyan-600 hover:underline font-medium"
            >
              お問い合わせフォームへ →
            </Link>
          </div>

          {/* Share */}
          <div className="mt-6 pt-6 border-t">
            <ShareButtons productName={product.name} productId={product.id} />
          </div>

          {/* Reviews */}
          <ProductReviews productId={product.id} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="font-serif-jp text-xl lg:text-2xl font-medium mb-8 tracking-wide">関連商品</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* Recently Viewed */}
      <RecentlyViewed excludeId={product.id} />

      {/* Track View */}
      <TrackView product={product} />
    </div>
  );
}
