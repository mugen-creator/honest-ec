import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().url(),
  linkUrl: z.string().nullable().optional(),
  linkText: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// バナー一覧取得
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(banners);
  } catch (error) {
    // テーブルが存在しない場合は空配列を返す
    console.error("Get banners error:", error);
    return NextResponse.json([]);
  }
}

// バナー作成
export async function POST(request: NextRequest) {
  try {
    // TODO: 管理者認証チェック

    const body = await request.json();
    const data = bannerSchema.parse(body);

    const banner = await prisma.banner.create({
      data,
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Create banner error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}
