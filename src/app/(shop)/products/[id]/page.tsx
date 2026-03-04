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

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

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
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-black">
          ホーム
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-black">
          商品一覧
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-black"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-black truncate max-w-[200px]">{product.name}</span>
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
            className="text-amber-600 text-sm font-medium hover:underline"
          >
            {product.brand.name}
          </Link>

          {/* Name */}
          <h1 className="text-2xl lg:text-3xl font-bold mt-2 mb-4">
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
              <div className="text-center py-4 bg-gray-100">
                <span className="text-gray-500 font-medium">SOLD OUT</span>
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
              <Shield className="w-5 h-5 text-amber-600" />
              <span className="text-sm">正規品保証</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-amber-600" />
              <span className="text-sm">送料無料</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-amber-600" />
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
              className="text-sm text-amber-600 hover:underline font-medium"
            >
              お問い合わせフォームへ →
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-xl lg:text-2xl font-bold mb-8">関連商品</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
