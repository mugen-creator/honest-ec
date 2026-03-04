export const metadata = {
  title: "特定商取引法に基づく表記",
};

export default function TokushohoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
      <h1 className="font-serif-jp text-3xl font-medium tracking-wide text-center mb-12">
        特定商取引法に基づく表記
      </h1>

      <div className="prose prose-gray max-w-none">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 w-1/3 align-top text-gray-500 font-normal">
                販売業者
              </th>
              <td className="py-4">合同会社Honest</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                運営責任者
              </th>
              <td className="py-4">町田 強平</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                所在地
              </th>
              <td className="py-4">〒169-0072 東京都新宿区大久保2丁目19-15 サンフォレスト405号室</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                電話番号
              </th>
              <td className="py-4">03-4500-3763（平日 10:00〜18:00）</td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                メールアドレス
              </th>
              <td className="py-4">info@maison.k-honest.com</td>
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
              <td className="py-4">
                クレジットカード（VISA、Mastercard、JCB、AMEX）
                <br />
                銀行振込
              </td>
            </tr>
            <tr className="border-b">
              <th className="text-left py-4 pr-4 align-top text-gray-500 font-normal">
                支払い時期
              </th>
              <td className="py-4">
                クレジットカード：ご注文確定時
                <br />
                銀行振込：ご注文後7日以内
              </td>
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
              <td className="py-4">東京都公安委員会 第304362420799号</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
