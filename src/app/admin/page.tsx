import { Package, ShoppingCart, Users, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // 実際のデータを取得
  const [productCount, orderCount, userCount, inquiryCount, recentOrders, recentInquiries] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.user.count(),
    prisma.inquiry.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    { label: "商品数", value: productCount.toString(), icon: Package, color: "bg-blue-500" },
    { label: "今月の注文", value: orderCount.toString(), icon: ShoppingCart, color: "bg-green-500" },
    { label: "会員数", value: userCount.toString(), icon: Users, color: "bg-purple-500" },
    { label: "未対応の問い合わせ", value: inquiryCount.toString(), icon: MessageSquare, color: "bg-amber-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">ダッシュボード</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6"
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
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold mb-4">最近の注文</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">注文がありません</p>
          ) : (
            <ul className="space-y-3">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex justify-between items-center text-sm">
                  <span>{order.orderNumber}</span>
                  <span className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("ja-JP")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold mb-4">最近の問い合わせ</h2>
          {recentInquiries.length === 0 ? (
            <p className="text-gray-500 text-sm">問い合わせがありません</p>
          ) : (
            <ul className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="flex justify-between items-center text-sm">
                  <span className="truncate max-w-[200px]">{inquiry.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    inquiry.status === "PENDING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {inquiry.status === "PENDING" ? "未対応" : "対応済"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
