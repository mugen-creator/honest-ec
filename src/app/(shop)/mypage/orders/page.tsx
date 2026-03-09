import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Package } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "注文履歴",
};

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "注文受付",
  PAYMENT_CONFIRMED: "入金確認済",
  SHIPPED: "発送済",
  DELIVERED: "配達完了",
  CANCELLED: "キャンセル",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAYMENT_CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/mypage/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
              brand: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      {/* Back Link */}
      <Link
        href="/mypage"
        className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        マイページに戻る
      </Link>

      <h1 className="font-serif-jp text-2xl font-medium tracking-wide mb-8">注文履歴</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50">
          <p className="text-gray-500 mb-4">注文履歴がありません</p>
          <Link
            href="/products"
            className="text-cyan-600 hover:underline font-medium"
          >
            商品を見る →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200">
              {/* Order Header */}
              <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-gray-500">注文番号: </span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">注文日: </span>
                    <span>{new Date(order.createdAt).toLocaleDateString("ja-JP")}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    statusColors[order.status] || "bg-gray-100"
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-4 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 flex-shrink-0">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-cyan-600">{item.product.brand.name}</p>
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium hover:underline line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t px-4 py-3 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  配送先: {order.shippingPrefecture}{order.shippingCity}
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">合計: </span>
                  <span className="text-lg font-bold">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
