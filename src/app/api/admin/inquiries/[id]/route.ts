import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInquiryReplyEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reply, status, sendEmail, customerEmail, customerName } = body;

    // 問い合わせを更新
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        reply,
        status,
      },
    });

    // メール送信
    if (sendEmail && customerEmail && reply) {
      await sendInquiryReplyEmail(
        customerEmail,
        customerName,
        reply
      );
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("Inquiry update error:", error);
    return NextResponse.json(
      { error: "問い合わせの更新に失敗しました" },
      { status: 500 }
    );
  }
}
