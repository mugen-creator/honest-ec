import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "商品の登録に失敗しました" },
      { status: 500 }
    );
  }
}
