import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "注文受付",
  PAYMENT_CONFIRMED: "入金確認済",
  SHIPPED: "発送済",
  DELIVERED: "配達完了",
  CANCELLED: "キャンセル",
};

export async function GET(request: NextRequest) {
  // TODO: 管理者認証チェック

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = {};
  if (from) where.createdAt = { ...where.createdAt, gte: new Date(from) };
  if (to) where.createdAt = { ...where.createdAt, lte: new Date(to) };

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // CSV生成
  const headers = [
    "注文番号",
    "注文日時",
    "ステータス",
    "会員メール",
    "配送先名",
    "配送先電話番号",
    "配送先郵便番号",
    "配送先都道府県",
    "配送先市区町村",
    "配送先住所",
    "配送先建物名",
    "商品名",
    "商品価格",
    "合計金額",
    "割引額",
    "支払方法",
  ];

  const rows = orders.flatMap((order) =>
    order.items.map((item, index) => [
      index === 0 ? order.orderNumber : "",
      index === 0 ? order.createdAt.toISOString() : "",
      index === 0 ? statusLabels[order.status] || order.status : "",
      index === 0 ? order.user.email : "",
      index === 0 ? order.shippingName : "",
      index === 0 ? order.shippingPhone : "",
      index === 0 ? order.shippingPostal : "",
      index === 0 ? order.shippingPrefecture : "",
      index === 0 ? order.shippingCity : "",
      index === 0 ? order.shippingAddress : "",
      index === 0 ? order.shippingBuilding || "" : "",
      item.product.name,
      item.price.toString(),
      index === 0 ? order.totalAmount.toString() : "",
      index === 0 ? (order.discountAmount || 0).toString() : "",
      index === 0 ? order.paymentMethod || "" : "",
    ])
  );

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const bom = "\uFEFF";
  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
