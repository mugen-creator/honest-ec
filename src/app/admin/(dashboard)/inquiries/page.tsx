import Link from "next/link";
import { Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "問い合わせ管理",
};

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "未対応",
  REPLIED: "返信済",
  CLOSED: "クローズ",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  REPLIED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
      user: true,
    },
  });

  const pendingCount = inquiries.filter((i) => i.status === "PENDING").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">問い合わせ管理</h1>
        {pendingCount > 0 && (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
            未対応: {pendingCount}件
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            問い合わせがありません
          </div>
        ) : (
          <div className="divide-y">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`p-4 hover:bg-gray-50 ${
                  inquiry.status === "PENDING" ? "bg-amber-50" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{inquiry.name}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[inquiry.status]}`}>
                        {statusLabels[inquiry.status]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {inquiry.email}
                    </div>
                    {inquiry.subject && (
                      <div className="text-sm font-medium mb-1">
                        {inquiry.subject}
                      </div>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {inquiry.message}
                    </p>
                    {inquiry.product && (
                      <div className="mt-2 text-xs text-amber-600">
                        関連商品: {inquiry.product.name}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleString("ja-JP")}
                    </div>
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="flex items-center gap-1 text-amber-600 hover:underline text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      詳細・返信
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
