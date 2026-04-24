import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewArrivalEmail } from "@/lib/email";
import { broadcastNewArrivalToLine } from "@/lib/line";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      brandId,
      categoryId,
      condition,
      serialNumber,
      certificate,
      stock,
      isPublished,
      images,
    } = body;

    // バリデーション
    if (!name || !description || !price || !brandId || !categoryId || !condition) {
      return NextResponse.json(
        { error: "必須項目を入力してください" },
        { status: 400 }
      );
    }

    // ブランド名を取得
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    // 商品を作成
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        brandId,
        categoryId,
        condition,
        serialNumber: serialNumber || null,
        certificate: certificate || null,
        stock: stock || 1,
        isPublished: isPublished || false,
        images: {
          create: (images || []).map((url: string, index: number) => ({
            url,
            sortOrder: index,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    // 公開された場合、全会員に新着通知を送信
    if (isPublished) {
      const customers = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        select: { email: true, name: true },
      });

      // バックグラウンドで送信（レスポンスをブロックしない）
      Promise.all(
        customers.map((customer) =>
          sendNewArrivalEmail(
            customer.email,
            customer.name || "お客様",
            name,
            product.id,
            brand?.name || "",
            price
          )
        )
      ).catch((err) => console.error("New arrival email error:", err));

      broadcastNewArrivalToLine({
        name,
        price,
        imageUrl: product.images[0]?.url,
        productId: product.id,
      }).catch((err) => console.error("New arrival LINE error:", err));
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "商品の登録に失敗しました" },
      { status: 500 }
    );
  }
}
