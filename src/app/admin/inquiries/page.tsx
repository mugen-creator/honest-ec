export const metadata = {
  title: "問い合わせ管理",
};

export default function AdminInquiriesPage() {
  // TODO: 実際の問い合わせデータを取得
  const inquiries: unknown[] = [];

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
                  件名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  送信者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  日時
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Inquiry rows will be rendered here */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
