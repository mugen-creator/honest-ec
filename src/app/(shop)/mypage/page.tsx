import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Heart, Settings, LogOut } from "lucide-react";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "マイページ",
};

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/mypage");
  }

  const menuItems = [
    {
      href: "/mypage/orders",
      icon: Package,
      title: "注文履歴",
      description: "過去のご注文を確認できます",
    },
    {
      href: "/mypage/favorites",
      icon: Heart,
      title: "お気に入り",
      description: "お気に入りに登録した商品",
    },
    {
      href: "/mypage/settings",
      icon: Settings,
      title: "会員情報",
      description: "登録情報の確認・変更",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif-jp text-2xl lg:text-3xl font-medium tracking-wide mb-2">マイページ</h1>
        <p className="text-gray-600">
          ようこそ、{session.user.name || session.user.email} さん
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block p-6 border border-gray-200 hover:border-black transition-colors group"
          >
            <item.icon className="w-8 h-8 mb-4 text-amber-600" />
            <h2 className="font-bold mb-1 group-hover:text-amber-600 transition-colors">
              {item.title}
            </h2>
            <p className="text-sm text-gray-500">{item.description}</p>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-8 pt-8 border-t">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>ログアウト</span>
          </button>
        </form>
      </div>
    </div>
  );
}
