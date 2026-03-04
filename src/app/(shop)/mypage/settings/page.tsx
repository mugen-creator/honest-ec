import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/mypage/settings-form";

export const metadata = {
  title: "会員情報",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/mypage/settings");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      phone: true,
      postalCode: true,
      prefecture: true,
      city: true,
      address: true,
      building: true,
    },
  });

  if (!user) {
    redirect("/login");
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

      <h1 className="font-serif-jp text-2xl font-medium tracking-wide mb-8">会員情報の変更</h1>

      <SettingsForm initialUser={user} />

      {/* アカウント操作 */}
      <section className="mt-12 pt-8 border-t">
        <h2 className="font-bold mb-4">アカウント設定</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <p className="font-medium">パスワードの変更</p>
              <p className="text-sm text-gray-500">
                ログインパスワードを変更します
              </p>
            </div>
            <Link
              href="/mypage/settings/password"
              className="text-sm text-amber-600 hover:underline"
            >
              変更する
            </Link>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded">
            <div>
              <p className="font-medium text-red-700">アカウントの削除</p>
              <p className="text-sm text-red-500">
                アカウントを完全に削除します。この操作は取り消せません。
              </p>
            </div>
            <Link
              href="/mypage/settings/delete"
              className="text-sm text-red-600 hover:underline"
            >
              削除する
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
