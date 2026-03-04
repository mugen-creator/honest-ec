import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().url().optional(),
  linkUrl: z.string().nullable().optional(),
  linkText: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// バナー取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const banner = await prisma.banner.findUnique({
    where: { id },
  });

  if (!banner) {
    return NextResponse.json({ error: "バナーが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(banner);
}

// バナー更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: 管理者認証チェック
    const { id } = await params;

    const body = await request.json();
    const data = updateSchema.parse(body);

    const banner = await prisma.banner.update({
      where: { id },
      data,
    });

    return NextResponse.json(banner);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Update banner error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}

// バナー部分更新（公開/非公開切替など）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: 管理者認証チェック
    const { id } = await params;

    const body = await request.json();
    const data = updateSchema.parse(body);

    const banner = await prisma.banner.update({
      where: { id },
      data,
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Patch banner error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}

// バナー削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: 管理者認証チェック
    const { id } = await params;

    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}
