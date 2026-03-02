export const metadata = {
  title: "会員管理",
};

export default function AdminMembersPage() {
  // TODO: 実際の会員データを取得
  const members: unknown[] = [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">会員管理</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            会員がありません
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Member rows will be rendered here */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
