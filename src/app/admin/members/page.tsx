import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "会員管理",
};

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  let members: Array<{
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: Date;
    _count: { orders: number };
  }> = [];
  let error = null;

  try {
    members = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
    console.error("Members error:", e);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">会員管理</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          エラー: {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {error ? "データを取得できませんでした" : "会員がありません"}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  名前
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  メールアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  登録日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  注文回数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  権限
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {member.name || "未設定"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(member.createdAt).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {member._count.orders}回
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        member.role === "ADMIN"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {member.role === "ADMIN" ? "管理者" : "会員"}
                    </span>
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
