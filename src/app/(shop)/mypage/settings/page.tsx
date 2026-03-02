import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "会員情報",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/mypage/settings");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 lg:py-12">
      {/* Back Link */}
      <Link
        href="/mypage"
        className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        マイページに戻る
      </Link>

      <h1 className="text-2xl font-bold mb-8">会員情報</h1>

      {/* User Info */}
      <div className="space-y-6">
        <div className="border-b pb-6">
          <h2 className="font-bold mb-4">基本情報</h2>
          <dl className="grid grid-cols-[120px,1fr] gap-y-4 text-sm">
            <dt className="text-gray-500">お名前</dt>
            <dd>{session.user.name || "未設定"}</dd>

            <dt className="text-gray-500">メールアドレス</dt>
            <dd>{session.user.email}</dd>
          </dl>
        </div>

        <div className="border-b pb-6">
          <h2 className="font-bold mb-4">配送先住所</h2>
          <p className="text-sm text-gray-500">配送先住所が登録されていません</p>
          {/* TODO: 住所登録フォーム */}
        </div>

        <div>
          <h2 className="font-bold mb-4">アカウント</h2>
          <div className="space-y-2">
            <button className="text-sm text-amber-600 hover:underline">
              パスワードを変更する
            </button>
            <br />
            <button className="text-sm text-red-600 hover:underline">
              アカウントを削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
