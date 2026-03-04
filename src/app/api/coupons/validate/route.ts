import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1, "クーポンコードを入力してください"),
  totalAmount: z.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, totalAmount } = schema.parse(body);

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "クーポンが見つかりません" },
        { status: 404 }
      );
    }

    // 有効性チェック
    const now = new Date();

    if (!coupon.isActive) {
      return NextResponse.json(
        { error: "このクーポンは無効です" },
        { status: 400 }
      );
    }

    if (now < coupon.validFrom) {
      return NextResponse.json(
        { error: "このクーポンはまだ有効期間前です" },
        { status: 400 }
      );
    }

    if (now > coupon.validUntil) {
      return NextResponse.json(
        { error: "このクーポンは有効期限が切れています" },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: "このクーポンは使用回数の上限に達しました" },
        { status: 400 }
      );
    }

    if (coupon.minPurchase && totalAmount < coupon.minPurchase) {
      return NextResponse.json(
        {
          error: `このクーポンは${coupon.minPurchase.toLocaleString()}円以上のご購入で使用できます`,
        },
        { status: 400 }
      );
    }

    // 割引額を計算
    let discountAmount: number;

    if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.floor(totalAmount * (coupon.value / 100));
      // 最大割引額の制限
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    // 割引額が合計を超えないようにする
    if (discountAmount > totalAmount) {
      discountAmount = totalAmount;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
      discountAmount,
      finalAmount: totalAmount - discountAmount,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}
