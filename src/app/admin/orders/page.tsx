import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Eye } from "lucide-react";

export const metadata = {
  title: "注文管理",
};

export const dynamic = "force-dynamic";

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

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">注文管理</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            注文がありません
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-bold">{order.orderNumber}</span>
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                      statusLabels={statusLabels}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{new Date(order.createdAt).toLocaleString("ja-JP")}</span>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center gap-1 text-amber-600 hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      詳細
                    </Link>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  {/* 顧客情報 */}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">顧客</div>
                    <div className="font-medium">{order.shippingName}</div>
                    <div className="text-gray-600 text-xs">{order.user.email}</div>
                  </div>

                  {/* 商品 */}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">商品</div>
                    {order.items.map((item) => (
                      <div key={item.id} className="truncate">
                        {item.product.name}
                      </div>
                    ))}
                  </div>

                  {/* 支払・金額 */}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">支払方法</div>
                    <div>
                      {order.paymentMethod
                        ? paymentLabels[order.paymentMethod] || order.paymentMethod
                        : "-"}
                    </div>
                    <div className="font-bold text-lg mt-1">
                      {formatPrice(order.totalAmount)}
                    </div>
                  </div>

                  {/* 配送先 */}
                  <div>
                    <div className="text-gray-500 text-xs mb-1">配送先</div>
                    <div className="text-xs">
                      〒{order.shippingPostal}<br />
                      {order.shippingPrefecture}{order.shippingCity}{order.shippingAddress}
                      {order.shippingBuilding && <><br />{order.shippingBuilding}</>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
