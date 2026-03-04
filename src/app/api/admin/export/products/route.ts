import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const conditionLabels: Record<string, string> = {
  NEW: "新品",
  S: "未使用に近い",
  A: "目立った傷や汚れなし",
  B: "やや傷や汚れあり",
  C: "傷や汚れあり",
};

export async function GET() {
  // TODO: 管理者認証チェック

  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "商品ID",
    "商品名",
    "価格",
    "ブランド",
    "カテゴリー",
    "状態",
    "在庫",
    "公開状態",
    "シリアル番号",
    "付属品・証明",
    "説明",
    "画像URL",
    "登録日",
    "更新日",
  ];

  const rows = products.map((product) => [
    product.id,
    product.name,
    product.price.toString(),
    product.brand.name,
    product.category.name,
    conditionLabels[product.condition] || product.condition,
    product.stock.toString(),
    product.isPublished ? "公開" : "非公開",
    product.serialNumber || "",
    product.certificate || "",
    product.description,
    product.images.map((img) => img.url).join(" | "),
    product.createdAt.toISOString(),
    product.updatedAt.toISOString(),
  ]);

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
      "Content-Disposition": `attachment; filename="products_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
