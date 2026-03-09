import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRestockNotificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "商品が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "商品の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // 既存の商品を確認
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "商品が見つかりません" },
        { status: 404 }
      );
    }

    // 画像を更新（既存の画像を削除して新しい画像を追加）
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    // 再入荷チェック（在庫0→1以上）
    const wasOutOfStock = existing.stock === 0;
    const isNowInStock = (stock || 1) > 0;
    const shouldSendRestockNotification = wasOutOfStock && isNowInStock;

    // 商品を更新
    const product = await prisma.product.update({
      where: { id },
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

    // 再入荷通知を送信
    if (shouldSendRestockNotification && isPublished) {
      const notifications = await prisma.restockNotification.findMany({
        where: { productId: id, notified: false },
      });

      for (const notification of notifications) {
        await sendRestockNotificationEmail(notification.email, name, id);
        await prisma.restockNotification.update({
          where: { id: notification.id },
          data: { notified: true },
        });
      }
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "商品の更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 既存の商品を確認
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "商品が見つかりません" },
        { status: 404 }
      );
    }

    // 関連する画像も削除される（onDelete: Cascade）
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "商品の削除に失敗しました" },
      { status: 500 }
    );
  }
}
