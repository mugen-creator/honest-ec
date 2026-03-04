import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmEmail } from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number(),
    })
  ),
  shippingName: z.string(),
  shippingPhone: z.string(),
  shippingPostal: z.string(),
  shippingPrefecture: z.string(),
  shippingCity: z.string(),
  shippingAddress: z.string(),
  shippingBuilding: z.string().optional(),
  paymentMethod: z.enum(["credit_card", "bank_transfer"]),
  totalAmount: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = await request.json();
    const data = orderSchema.parse(body);

    // 注文番号を生成
    const orderNumber = `HM${Date.now()}`;

    // 注文を作成
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        status: "PENDING",
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingPostal: data.shippingPostal,
        shippingPrefecture: data.shippingPrefecture,
        shippingCity: data.shippingCity,
        shippingAddress: data.shippingAddress,
        shippingBuilding: data.shippingBuilding || null,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            price: item.price,
          })),
        },
      },
    });

    // 商品の在庫を減らす
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: 1 } },
      });
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // 注文確認メール送信
    if (user?.email) {
      await sendOrderConfirmEmail(
        user.email,
        data.shippingName,
        orderNumber,
        data.items.map((item) => ({ name: item.name, price: item.price })),
        data.totalAmount,
        data.paymentMethod
      );
    }

    return NextResponse.json(
      { message: "注文が完了しました", orderId: order.id, orderNumber },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります" },
        { status: 400 }
      );
    }

    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "注文処理に失敗しました" },
      { status: 500 }
    );
  }
}
