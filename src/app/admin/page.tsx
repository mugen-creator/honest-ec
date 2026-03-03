import { Package, ShoppingCart, Users, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let productCount = 0;
  let orderCount = 0;
  let userCount = 0;
  let inquiryCount = 0;
  let error = null;

  try {
    const results = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.inquiry.count({ where: { status: "PENDING" } }),
    ]);
    productCount = results[0];
    orderCount = results[1];
    userCount = results[2];
    inquiryCount = results[3];
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
    console.error("Dashboard error:", e);
  }

  const stats = [
    { label: "商品数", value: productCount.toString(), icon: Package, color: "bg-blue-500" },
    { label: "注文数", value: orderCount.toString(), icon: ShoppingCart, color: "bg-green-500" },
    { label: "会員数", value: userCount.toString(), icon: Users, color: "bg-purple-500" },
    { label: "未対応の問い合わせ", value: inquiryCount.toString(), icon: MessageSquare, color: "bg-amber-500" },
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
          <p className="text-gray-500 text-sm">注文がありません</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold mb-4">最近の問い合わせ</h2>
          <p className="text-gray-500 text-sm">問い合わせがありません</p>
        </div>
      </div>
    </div>
  );
}
