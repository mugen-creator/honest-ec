import { NextResponse } from "next/server";
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
