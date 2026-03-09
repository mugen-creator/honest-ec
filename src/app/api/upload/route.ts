import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// クライアントサイドアップロード用のトークン生成
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // ファイル形式チェック
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
        const ext = pathname.toLowerCase().slice(pathname.lastIndexOf("."));
        if (!allowedExtensions.includes(ext)) {
          throw new Error("JPEG, PNG, WebP, GIF形式の画像のみアップロード可能です");
        }

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Upload completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "アップロードに失敗しました" },
      { status: 500 }
    );
  }
}
