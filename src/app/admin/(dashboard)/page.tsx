import Link from "next/link";
import { Package, ShoppingCart, Users, MessageSquare, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

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

const inquiryStatusLabels: Record<string, string> = {
  PENDING: "未対応",
  REPLIED: "返信済",
  CLOSED: "クローズ",
};

const inquiryStatusColors: Record<string, string> = {
  PENDING: "bg-cyan-100 text-amber-800",
  REPLIED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export default async function AdminDashboard() {
  let productCount = 0;
  let orderCount = 0;
  let userCount = 0;
  let inquiryCount = 0;
  let recentOrders: any[] = [];
  let recentInquiries: any[] = [];
  let error = null;

  try {
    const [counts, orders, inquiries] = await Promise.all([
      Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.inquiry.count({ where: { status: "PENDING" } }),
      ]),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: true,
          items: { include: { product: true } },
        },
      }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    productCount = counts[0];
    orderCount = counts[1];
    userCount = counts[2];
    inquiryCount = counts[3];
    recentOrders = orders;
    recentInquiries = inquiries;
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
    console.error("Dashboard error:", e);
  }

  const stats = [
    { label: "商品数", value: productCount.toString(), icon: Package, color: "bg-blue-500", href: "/admin/products" },
    { label: "注文数", value: orderCount.toString(), icon: ShoppingCart, color: "bg-green-500", href: "/admin/orders" },
    { label: "会員数", value: userCount.toString(), icon: Users, color: "bg-purple-500", href: "/admin/members" },
    { label: "未対応の問い合わせ", value: inquiryCount.toString(), icon: MessageSquare, color: "bg-cyan-500", href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">ダッシュボード</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          エラー: {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近の注文 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">最近の注文</h2>
            <Link href="/admin/orders" className="text-cyan-600 hover:underline text-sm flex items-center gap-1">
              すべて見る <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">注文がありません</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-3 border rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{order.shippingName}</span>
                    <span className="font-bold">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString("ja-JP")}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 最近の問い合わせ */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">最近の問い合わせ</h2>
            <Link href="/admin/inquiries" className="text-cyan-600 hover:underline text-sm flex items-center gap-1">
              すべて見る <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-gray-500 text-sm">問い合わせがありません</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/admin/inquiries/${inquiry.id}`}
                  className={`block p-3 border rounded hover:bg-gray-50 transition-colors ${
                    inquiry.status === "PENDING" ? "border-amber-300 bg-cyan-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{inquiry.name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${inquiryStatusColors[inquiry.status]}`}>
                      {inquiryStatusLabels[inquiry.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {inquiry.subject || inquiry.message}
                  </p>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(inquiry.createdAt).toLocaleString("ja-JP")}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
