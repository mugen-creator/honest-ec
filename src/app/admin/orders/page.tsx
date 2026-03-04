import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

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
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  注文番号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  顧客名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  商品
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  日時
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>{order.shippingName}</div>
                    <div className="text-gray-500 text-xs">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.items.map((item, index) => (
                      <div key={item.id} className={index > 0 ? "mt-1" : ""}>
                        {item.product.name}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                      statusLabels={statusLabels}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString("ja-JP")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
