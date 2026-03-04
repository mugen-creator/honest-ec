import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import { SalesChart } from "@/components/admin/sales-chart";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "売上レポート",
};

async function getSalesData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // 過去30日の注文
  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: { not: "CANCELLED" },
    },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // 前30日の注文（比較用）
  const previousOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      status: { not: "CANCELLED" },
    },
  });

  // 日別売上データ
  const dailySales: { date: string; amount: number; count: number }[] = [];
  const salesByDate = new Map<string, { amount: number; count: number }>();

  recentOrders.forEach((order) => {
    const date = order.createdAt.toISOString().split("T")[0];
    const existing = salesByDate.get(date) || { amount: 0, count: 0 };
    salesByDate.set(date, {
      amount: existing.amount + order.totalAmount,
      count: existing.count + 1,
    });
  });

  // 過去30日分のデータを埋める
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const data = salesByDate.get(dateStr) || { amount: 0, count: 0 };
    dailySales.push({ date: dateStr, ...data });
  }

  // 人気商品
  const productSales = new Map<string, { product: any; count: number; revenue: number }>();
  recentOrders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = productSales.get(item.productId) || {
        product: item.product,
        count: 0,
        revenue: 0,
      };
      productSales.set(item.productId, {
        product: item.product,
        count: existing.count + 1,
        revenue: existing.revenue + item.price,
      });
    });
  });

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // 集計
  const currentRevenue = recentOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const previousRevenue = previousOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const revenueChange = previousRevenue > 0
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
    : 0;

  const currentOrderCount = recentOrders.length;
  const previousOrderCount = previousOrders.length;
  const orderChange = previousOrderCount > 0
    ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100
    : 0;

  const avgOrderValue = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;

  // 新規会員数
  const newUsers = await prisma.user.count({
    where: { createdAt: { gte: thirtyDaysAgo } },
  });

  return {
    dailySales,
    topProducts,
    stats: {
      currentRevenue,
      revenueChange,
      currentOrderCount,
      orderChange,
      avgOrderValue,
      newUsers,
    },
  };
}

export default async function ReportsPage() {
  const { dailySales, topProducts, stats } = await getSalesData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">売上レポート</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">売上（30日間）</span>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{formatPrice(stats.currentRevenue)}</p>
          <div className={`flex items-center gap-1 text-sm mt-1 ${stats.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
            {stats.revenueChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{stats.revenueChange >= 0 ? "+" : ""}{stats.revenueChange.toFixed(1)}%</span>
            <span className="text-gray-400">前月比</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">注文数（30日間）</span>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{stats.currentOrderCount}件</p>
          <div className={`flex items-center gap-1 text-sm mt-1 ${stats.orderChange >= 0 ? "text-green-600" : "text-red-600"}`}>
            {stats.orderChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{stats.orderChange >= 0 ? "+" : ""}{stats.orderChange.toFixed(1)}%</span>
            <span className="text-gray-400">前月比</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">平均注文額</span>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{formatPrice(Math.round(stats.avgOrderValue))}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">新規会員（30日間）</span>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{stats.newUsers}人</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="font-bold mb-4">日別売上推移</h2>
        <SalesChart data={dailySales} />
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-bold mb-4">人気商品ランキング（30日間）</h2>
        {topProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">データがありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">順位</th>
                  <th className="pb-3 font-medium">商品名</th>
                  <th className="pb-3 font-medium text-right">販売数</th>
                  <th className="pb-3 font-medium text-right">売上</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((item, index) => (
                  <tr key={item.product.id} className="border-b last:border-0">
                    <td className="py-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index === 0 ? "bg-amber-400 text-white" :
                        index === 1 ? "bg-gray-300 text-gray-700" :
                        index === 2 ? "bg-amber-600 text-white" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                    </td>
                    <td className="py-3 text-right text-sm">{item.count}点</td>
                    <td className="py-3 text-right font-medium">{formatPrice(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
