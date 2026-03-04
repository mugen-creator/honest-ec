import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(/[A-Za-z]/, "パスワードには英字を含めてください")
    .regex(/[0-9]/, "パスワードには数字を含めてください"),
  name: z.string().min(1, "お名前を入力してください"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name,
      },
    });

    // 会員登録完了メール送信
    await sendWelcomeEmail(email, name);

    return NextResponse.json(
      { message: "会員登録が完了しました", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      return NextResponse.json(
        { error: zodError.issues[0]?.message || "入力内容に誤りがあります" },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "会員登録に失敗しました" },
      { status: 500 }
    );
  }
}
