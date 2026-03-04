import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber } = body;

    const validStatuses = ["PENDING", "PAYMENT_CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "無効なステータスです" },
        { status: 400 }
      );
    }

    // 現在の注文を取得
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: "注文が見つかりません" },
        { status: 404 }
      );
    }

    // ステータスが変更された場合のみメール送信
    const statusChanged = currentOrder.status !== status;

    // 注文を更新
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // ステータス変更時にメール送信（PENDING以外）
    if (statusChanged && status !== "PENDING" && currentOrder.user?.email) {
      await sendOrderStatusEmail(
        currentOrder.user.email,
        currentOrder.shippingName,
        currentOrder.orderNumber,
        status,
        trackingNumber
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "注文の更新に失敗しました" },
      { status: 500 }
    );
  }
}
