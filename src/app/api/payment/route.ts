import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { squareClient, SQUARE_LOCATION_ID } from "@/lib/square";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { sourceId, amount, orderId } = await request.json();

    if (!sourceId || !amount) {
      return NextResponse.json(
        { error: "必要なパラメータが不足しています" },
        { status: 400 }
      );
    }

    const response = await squareClient.payments.create({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(amount),
        currency: "JPY",
      },
      locationId: SQUARE_LOCATION_ID,
      referenceId: orderId,
    });

    if (response.payment?.status === "COMPLETED") {
      return NextResponse.json({
        success: true,
        paymentId: response.payment.id,
      });
    } else {
      return NextResponse.json(
        { error: "決済処理に失敗しました" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Payment error:", error);

    let errorMessage = "決済処理中にエラーが発生しました";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
