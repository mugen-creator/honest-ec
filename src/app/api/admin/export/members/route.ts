import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  // TODO: 管理者認証チェック

  const users = await prisma.user.findMany({
    include: {
      orders: {
        where: { status: { not: "CANCELLED" } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "会員ID",
    "メールアドレス",
    "氏名",
    "電話番号",
    "郵便番号",
    "都道府県",
    "市区町村",
    "住所",
    "建物名",
    "権限",
    "注文回数",
    "累計購入額",
    "登録日",
  ];

  const rows = users.map((user) => {
    const totalPurchase = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return [
      user.id,
      user.email,
      user.name || "",
      user.phone || "",
      user.postalCode || "",
      user.prefecture || "",
      user.city || "",
      user.address || "",
      user.building || "",
      user.role === "ADMIN" ? "管理者" : "一般会員",
      user.orders.length.toString(),
      totalPurchase.toString(),
      user.createdAt.toISOString(),
    ];
  });

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
      "Content-Disposition": `attachment; filename="members_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
