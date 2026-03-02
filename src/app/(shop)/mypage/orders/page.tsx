import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "注文履歴",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/mypage/orders");
  }

  // TODO: 実際の注文データを取得
  const orders: unknown[] = [];

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

      <h1 className="text-2xl font-bold mb-8">注文履歴</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50">
          <p className="text-gray-500 mb-4">注文履歴がありません</p>
          <Link
            href="/products"
            className="text-amber-600 hover:underline font-medium"
          >
            商品を見る →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Order items will be rendered here */}
        </div>
      )}
    </div>
  );
}
