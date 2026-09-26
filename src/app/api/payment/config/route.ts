import { NextResponse } from "next/server";
import { SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID } from "@/lib/square";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    applicationId: SQUARE_APPLICATION_ID,
    locationId: SQUARE_LOCATION_ID,
  });
}
