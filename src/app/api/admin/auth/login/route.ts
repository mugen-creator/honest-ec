import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminToken,
  setAdminCookie,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "ユーザー名とパスワードを入力してください" },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "ユーザー名またはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    const token = await createAdminToken();
    await setAdminCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "ログインに失敗しました" },
      { status: 500 }
    );
  }
}
