"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">ショッピングカート</h1>
        <p className="text-gray-500 mb-8">カートに商品がありません</p>
        <Link href="/products">
          <Button>商品を見る</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-bold mb-8">ショッピングカート</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product }) => (
            <div
              key={product.id}
              className="flex gap-4 p-4 border border-gray-200"
            >
              {/* Image */}
              <Link
                href={`/products/${product.id}`}
                className="relative w-24 h-24 flex-shrink-0 bg-gray-100"
              >
                {product.images[0] && (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-amber-600 font-medium">
                  {product.brand.name}
                </p>
                <Link
                  href={`/products/${product.id}`}
                  className="font-medium hover:text-amber-600 line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="text-lg font-bold mt-2">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(product.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="カートから削除"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 sticky top-24">
            <h2 className="font-bold mb-4">ご注文内容</h2>

            <dl className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <dt className="text-gray-500">商品数</dt>
                <dd>{items.length}点</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">小計</dt>
                <dd>{formatPrice(getTotal())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">送料</dt>
                <dd>無料</dd>
              </div>
            </dl>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>合計</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">（税込）</p>
            </div>

            <Link href="/checkout">
              <Button className="w-full" size="lg">
                ご注文手続きへ
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link
              href="/products"
              className="block text-center text-sm text-gray-500 hover:text-black mt-4"
            >
              お買い物を続ける
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
