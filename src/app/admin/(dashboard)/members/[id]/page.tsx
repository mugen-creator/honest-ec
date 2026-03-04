import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "会員詳細",
};

export const dynamic = "force-dynamic";

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const member = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
      _count: {
        select: { orders: true, favorites: true },
      },
    },
  });

  if (!member) {
    notFound();
  }

  const totalSpent = member.orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/members"
          className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          会員一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold">会員詳細</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム: 基本情報 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本情報 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4">基本情報</h2>
            <dl className="grid grid-cols-[120px,1fr] gap-y-3 text-sm">
              <dt className="text-gray-500">会員ID</dt>
              <dd className="font-mono text-xs">{member.id}</dd>

              <dt className="text-gray-500">お名前</dt>
              <dd>{member.name || <span className="text-gray-400">未設定</span>}</dd>

              <dt className="text-gray-500">メールアドレス</dt>
              <dd>{member.email}</dd>

              <dt className="text-gray-500">電話番号</dt>
              <dd>{member.phone || <span className="text-gray-400">未設定</span>}</dd>

              <dt className="text-gray-500">権限</dt>
              <dd>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    member.role === "ADMIN"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {member.role === "ADMIN" ? "管理者" : "会員"}
                </span>
              </dd>

              <dt className="text-gray-500">登録日</dt>
              <dd>{new Date(member.createdAt).toLocaleDateString("ja-JP")}</dd>
            </dl>
          </div>

          {/* 住所情報 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4">登録住所</h2>
            {member.postalCode ? (
              <dl className="grid grid-cols-[120px,1fr] gap-y-3 text-sm">
                <dt className="text-gray-500">郵便番号</dt>
                <dd>{member.postalCode}</dd>

                <dt className="text-gray-500">都道府県</dt>
                <dd>{member.prefecture}</dd>

                <dt className="text-gray-500">市区町村</dt>
                <dd>{member.city}</dd>

                <dt className="text-gray-500">番地</dt>
                <dd>{member.address}</dd>

                {member.building && (
                  <>
                    <dt className="text-gray-500">建物名</dt>
                    <dd>{member.building}</dd>
                  </>
                )}
              </dl>
            ) : (
              <p className="text-sm text-gray-400">住所が登録されていません</p>
            )}
          </div>

          {/* 注文履歴 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4">注文履歴（直近10件）</h2>
            {member.orders.length === 0 ? (
              <p className="text-sm text-gray-400">注文履歴がありません</p>
            ) : (
              <div className="space-y-4">
                {member.orders.map((order) => (
                  <div key={order.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-amber-600 hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("ja-JP")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status === "PENDING" && "注文受付"}
                          {order.status === "PAYMENT_CONFIRMED" && "入金確認済"}
                          {order.status === "SHIPPED" && "発送済"}
                          {order.status === "DELIVERED" && "配達完了"}
                          {order.status === "CANCELLED" && "キャンセル"}
                        </span>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-600">
                      {order.items.map((item) => (
                        <li key={item.id}>・{item.product.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右カラム: サマリー */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4">統計</h2>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-gray-500">注文回数</dt>
                <dd className="font-bold">{member._count.orders}回</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">累計購入金額</dt>
                <dd className="font-bold">{formatPrice(totalSpent)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">お気に入り</dt>
                <dd className="font-bold">{member._count.favorites}件</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
