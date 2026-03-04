import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Brands fetch error:", error);
    return NextResponse.json({ brands: [] });
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "ブランド名は必須です" },
        { status: 400 }
      );
    }

    const slug = generateSlug(name.trim());

    const existing = await prisma.brand.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "このブランドは既に登録されています" },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        slug,
      },
    });

    return NextResponse.json({ brand });
  } catch (error) {
    console.error("Brand create error:", error);
    return NextResponse.json(
      { error: "ブランドの作成に失敗しました" },
      { status: 500 }
    );
  }
}
