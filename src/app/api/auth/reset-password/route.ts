import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendPasswordChangedEmail } from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  token: z.string().min(1, "トークンが必要です"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(/[A-Za-z]/, "パスワードには英字を含めてください")
    .regex(/[0-9]/, "パスワードには数字を含めてください"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = schema.parse(body);

    // トークンでユーザーを検索
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "リンクが無効または期限切れです。再度パスワードリセットを申請してください。" },
        { status: 400 }
      );
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // パスワードを更新し、トークンをクリア
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // 変更完了メール送信
    await sendPasswordChangedEmail(user.email, user.name || "お客様");

    return NextResponse.json(
      { message: "パスワードが変更されました" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "入力内容に誤りがあります" },
        { status: 400 }
      );
    }

    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "処理に失敗しました" },
      { status: 500 }
    );
  }
}
