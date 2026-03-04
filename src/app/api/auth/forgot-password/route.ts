import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // セキュリティ上、ユーザーが存在しない場合も同じレスポンスを返す
    if (!user) {
      return NextResponse.json(
        { message: "メールアドレスが登録されている場合、リセット用のメールを送信しました" },
        { status: 200 }
      );
    }

    // リセットトークンを生成
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間有効

    // トークンをDBに保存
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expires,
      },
    });

    // メール送信
    await sendPasswordResetEmail(email, user.name || "お客様", resetToken);

    return NextResponse.json(
      { message: "メールアドレスが登録されている場合、リセット用のメールを送信しました" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "入力内容に誤りがあります" },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "処理に失敗しました" },
      { status: 500 }
    );
  }
}
