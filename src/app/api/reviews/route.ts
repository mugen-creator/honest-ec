import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, "レビューは10文字以上で入力してください").max(1000),
});

// レビュー一覧取得
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "商品IDが必要です" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: {
      productId,
      isApproved: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 平均評価を計算
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({
    reviews,
    stats: {
      count: reviews.length,
      avgRating: Math.round(avgRating * 10) / 10,
    },
  });
}

// レビュー投稿
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, rating, title, comment } = createSchema.parse(body);

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

    // 購入済みか確認
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: { in: ["PAYMENT_CONFIRMED", "SHIPPED", "DELIVERED"] },
        },
      },
    });

    if (!hasPurchased) {
      return NextResponse.json(
        { error: "この商品を購入された方のみレビューが可能です" },
        { status: 403 }
      );
    }

    // 既にレビュー済みか確認
    const existing = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "既にレビュー済みです" },
        { status: 400 }
      );
    }

    // レビュー作成
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title,
        comment,
        isApproved: false, // 管理者承認待ち
      },
    });

    return NextResponse.json(
      { message: "レビューを投稿しました。承認後に公開されます。", review },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}
