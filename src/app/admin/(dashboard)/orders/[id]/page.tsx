import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Package, User, MapPin, CreditCard, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusLabels: Record<string, string> = {
  PENDING: "注文受付",
  PAYMENT_CONFIRMED: "入金確認済",
  SHIPPED: "発送済",
  DELIVERED: "配達完了",
  CANCELLED: "キャンセル",
};

const paymentLabels: Record<string, string> = {
  credit_card: "クレジットカード",
  bank_transfer: "銀行振込",
};

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
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

  if (!order) {
    notFound();
  }

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        注文一覧に戻る
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">注文詳細</h1>
        <OrderStatusSelect
          orderId={order.id}
          currentStatus={order.status}
          statusLabels={statusLabels}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム: 注文情報 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 注文情報 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              注文情報
            </h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">注文番号</dt>
                <dd className="font-bold text-lg">{order.orderNumber}</dd>
              </div>
              <div>
                <dt className="text-gray-500">注文日時</dt>
                <dd>{new Date(order.createdAt).toLocaleString("ja-JP")}</dd>
              </div>
              <div>
                <dt className="text-gray-500">ステータス</dt>
                <dd>{statusLabels[order.status]}</dd>
              </div>
              <div>
                <dt className="text-gray-500">更新日時</dt>
                <dd>{new Date(order.updatedAt).toLocaleString("ja-JP")}</dd>
              </div>
            </dl>
          </div>

          {/* 商品 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              注文商品
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
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
                  <div className="flex-1">
                    <p className="text-xs text-cyan-600">{item.product.brand.name}</p>
                    <Link
                      href={`/admin/products/${item.product.id}`}
                      className="font-medium hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-lg font-bold mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold">合計</span>
              <span className="text-2xl font-bold">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* 右カラム */}
        <div className="space-y-6">
          {/* 顧客情報 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              顧客情報
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">会員ID</dt>
                <dd>
                  <Link
                    href={`/admin/members/${order.user.id}`}
                    className="text-cyan-600 hover:underline"
                  >
                    {order.user.id}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">メール</dt>
                <dd>{order.user.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">登録日</dt>
                <dd>{new Date(order.user.createdAt).toLocaleDateString("ja-JP")}</dd>
              </div>
            </dl>
          </div>

          {/* 配送先 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              配送先
            </h2>
            <div className="text-sm space-y-2">
              <p className="font-medium">{order.shippingName}</p>
              <p className="text-gray-600">
                〒{order.shippingPostal}<br />
                {order.shippingPrefecture}{order.shippingCity}<br />
                {order.shippingAddress}
                {order.shippingBuilding && <><br />{order.shippingBuilding}</>}
              </p>
              <p className="text-gray-600">TEL: {order.shippingPhone}</p>
            </div>
          </div>

          {/* 支払情報 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              支払情報
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">支払方法</dt>
                <dd className="font-medium">
                  {order.paymentMethod
                    ? paymentLabels[order.paymentMethod] || order.paymentMethod
                    : "-"}
                </dd>
              </div>
              {order.stripePaymentId && (
                <div>
                  <dt className="text-gray-500">Stripe決済ID</dt>
                  <dd className="font-mono text-xs">{order.stripePaymentId}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* メモ */}
          {order.note && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-bold mb-4">メモ</h2>
              <p className="text-sm text-gray-600 whitespace-pre-line">{order.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
