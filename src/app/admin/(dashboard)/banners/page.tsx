import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteBannerButton } from "@/components/admin/delete-banner-button";
import { ToggleBannerButton } from "@/components/admin/toggle-banner-button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "バナー管理",
};

export default async function BannersPage() {
  let banners: any[] = [];
  let error = null;

  try {
    banners = await prisma.banner.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "テーブルが存在しません。prisma db pushを実行してください。";
    console.error("Banners error:", e);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">バナー管理</h1>
        <Link
          href="/admin/banners/new"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新規追加
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="font-medium">エラー</p>
          <p className="text-sm">Bannerテーブルが存在しません。以下のコマンドを実行してください:</p>
          <code className="block mt-2 p-2 bg-red-100 rounded text-xs">npx prisma db push</code>
        </div>
      )}

      {!error && (
        <div className="bg-white rounded-lg shadow-sm">
          {banners.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              バナーがありません。「新規追加」から追加してください。
            </div>
          ) : (
            <div className="divide-y">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className={`p-4 flex items-center gap-4 ${!banner.isActive ? "opacity-50" : ""}`}
                >
                  <div className="text-gray-400 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="relative w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{banner.title}</h3>
                      {!banner.isActive && (
                        <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                          非公開
                        </span>
                      )}
                    </div>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-500 truncate">{banner.subtitle}</p>
                    )}
                    {banner.linkUrl && (
                      <p className="text-xs text-cyan-600 truncate">{banner.linkUrl}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <ToggleBannerButton id={banner.id} isActive={banner.isActive} />
                    <Link
                      href={`/admin/banners/${banner.id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteBannerButton id={banner.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <p>💡 ヒント: バナーは「表示順」の小さい順に表示されます。</p>
      </div>
    </div>
  );
}
