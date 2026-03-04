import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, MessageSquare, LogOut, Tag, Bookmark, BarChart3, Image } from "lucide-react";
import { verifyAdminToken } from "@/lib/admin-auth";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

export const metadata = {
  title: {
    default: "管理画面",
    template: "%s | Honest-Maison 管理画面",
  },
};

const sidebarItems = [
  { href: "/admin", icon: LayoutDashboard, label: "ダッシュボード" },
  { href: "/admin/reports", icon: BarChart3, label: "売上レポート" },
  { href: "/admin/products", icon: Package, label: "商品管理" },
  { href: "/admin/categories", icon: Tag, label: "カテゴリー管理" },
  { href: "/admin/brands", icon: Bookmark, label: "ブランド管理" },
  { href: "/admin/banners", icon: Image, label: "バナー管理" },
  { href: "/admin/orders", icon: ShoppingCart, label: "注文管理" },
  { href: "/admin/members", icon: Users, label: "会員管理" },
  { href: "/admin/inquiries", icon: MessageSquare, label: "問い合わせ" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await verifyAdminToken();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white h-16 fixed top-0 left-0 right-0 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold">
            Honest-Maison
            <span className="text-amber-500 ml-2 text-sm font-normal">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">管理者</span>
            <Link
              href="/"
              className="text-sm text-gray-300 hover:text-white"
            >
              サイトを見る
            </Link>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
          <nav className="p-4">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t mt-4 pt-4">
              <AdminLogoutButton />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">{children}</main>
      </div>
    </div>
  );
}
