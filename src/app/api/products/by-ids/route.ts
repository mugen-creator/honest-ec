import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isPublished: true,
      },
      include: {
        brand: true,
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products by IDs fetch error:", error);
    return NextResponse.json({ products: [] });
  }
}
