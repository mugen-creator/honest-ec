import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  productId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, productId } = schema.parse(body);

    // 商品が存在するか確認
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "商品が見つかりません" },
        { status: 404 }
      );
    }

    // 既に登録済みか確認
    const existing = await prisma.restockNotification.findUnique({
      where: {
        email_productId: { email, productId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "既に登録済みです" },
        { status: 200 }
      );
    }

    // 通知を登録
    await prisma.restockNotification.create({
      data: { email, productId },
    });

    return NextResponse.json(
      { message: "再入荷通知を登録しました" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Restock notification error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}
