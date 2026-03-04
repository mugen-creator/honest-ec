import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactConfirmEmail, sendContactNotifyEmail } from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().min(1, "件名を入力してください"),
  message: z.string().min(10, "お問い合わせ内容は10文字以上で入力してください"),
  productId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, productId } = contactSchema.parse(body);

    // DBに保存
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        subject,
        message,
        productId: productId || null,
        status: "PENDING",
      },
    });

    // 顧客に確認メール送信
    await sendContactConfirmEmail(email, name, subject, message);

    // 管理者に通知メール送信
    await sendContactNotifyEmail(name, email, subject, message);

    return NextResponse.json(
      { message: "お問い合わせを受け付けました", inquiryId: inquiry.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "入力内容に誤りがあります" },
        { status: 400 }
      );
    }

    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "お問い合わせの送信に失敗しました" },
      { status: 500 }
    );
  }
}
