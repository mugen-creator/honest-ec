import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        postalCode: true,
        prefecture: true,
        city: true,
        address: true,
        building: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json({ error: "ユーザー情報の取得に失敗しました" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, postalCode, prefecture, city, address, building } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || null,
        phone: phone || null,
        postalCode: postalCode || null,
        prefecture: prefecture || null,
        city: city || null,
        address: address || null,
        building: building || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        postalCode: true,
        prefecture: true,
        city: true,
        address: true,
        building: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "ユーザー情報の更新に失敗しました" }, { status: 500 });
  }
}
