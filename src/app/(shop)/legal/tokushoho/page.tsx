export const metadata = {
  title: "特定商取引法に基づく表記",
};

export default function TokushohoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-center mb-12">
        特定商取引法に基づく表記
      </h1>

      <div className="prose prose-gray max-w-none">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 w-1/3 align-top text-gray-500 font-normal">
                販売業者
              </th>
              <td className="py-4">株式会社 Honest-Maison（仮）</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                運営責任者
              </th>
              <td className="py-4">○○ ○○</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                所在地
              </th>
              <td className="py-4">〒150-0000 東京都渋谷区○○○ 1-2-3</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                電話番号
              </th>
              <td className="py-4">03-XXXX-XXXX（平日 10:00〜18:00）</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                メールアドレス
              </th>
              <td className="py-4">info@honest-maison.com</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                販売価格
              </th>
              <td className="py-4">各商品ページに表示（税込価格）</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                送料
              </th>
              <td className="py-4">全国送料無料</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                支払い方法
              </th>
              <td className="py-4">クレジットカード（VISA、Mastercard、JCB、AMEX）</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                支払い時期
              </th>
              <td className="py-4">ご注文確定時</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                商品の引き渡し時期
              </th>
              <td className="py-4">
                ご注文確定後、3〜5営業日以内に発送いたします。
                <br />
                配送状況により前後する場合がございます。
              </td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                返品・交換
              </th>
              <td className="py-4">
                商品到着後7日以内にご連絡ください。
                <br />
                詳細は「返品・交換について」をご確認ください。
              </td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                古物商許可番号
              </th>
              <td className="py-4">東京都公安委員会 第○○○○○○○○号</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
