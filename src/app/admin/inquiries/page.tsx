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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">問い合わせ管理</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            問い合わせがありません
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  送信者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  メール
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  内容
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  日時
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {inquiry.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {inquiry.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p className="truncate max-w-[300px]">{inquiry.message}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[inquiry.status] || "bg-gray-100"}`}>
                      {statusLabels[inquiry.status] || inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(inquiry.createdAt).toLocaleString("ja-JP")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
