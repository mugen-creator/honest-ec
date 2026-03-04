import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "ブランドが見つかりません" },
        { status: 404 }
      );
    }

    if (brand._count.products > 0) {
      return NextResponse.json(
        { error: "このブランドには商品が登録されているため削除できません" },
        { status: 400 }
      );
    }

    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Brand delete error:", error);
    return NextResponse.json(
      { error: "ブランドの削除に失敗しました" },
      { status: 500 }
    );
  }
}
