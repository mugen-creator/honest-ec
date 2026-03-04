export const metadata = {
  title: "返品・交換について",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
      <h1 className="font-serif-jp text-3xl font-medium tracking-wide text-center mb-12">返品・交換について</h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">返品・交換の条件</h2>
          <p className="text-gray-600">
            以下の条件を満たす場合に限り、返品・交換を承ります。
          </p>
          <ul className="list-disc pl-6 text-gray-600 mt-2">
            <li>商品到着後7日以内にご連絡いただいた場合</li>
            <li>商品が未使用・未開封の場合</li>
            <li>タグ、付属品等がすべて揃っている場合</li>
            <li>お客様都合の返品の場合、送料はお客様負担となります</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">返品・交換ができない場合</h2>
          <ul className="list-disc pl-6 text-gray-600">
            <li>商品到着後8日以上経過した場合</li>
            <li>使用済み、または使用の痕跡がある場合</li>
            <li>お客様のもとで傷や汚れが生じた場合</li>
            <li>タグ、付属品等を紛失された場合</li>
            <li>商品ページに「返品不可」と記載がある場合</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">不良品・誤送の場合</h2>
          <p className="text-gray-600">
            商品に不良があった場合、または注文と異なる商品が届いた場合は、
            当社負担にて返品・交換いたします。商品到着後7日以内にご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">正規品保証</h2>
          <p className="text-gray-600">
            当社で販売するすべての商品は、正規品であることを保証いたします。
            万が一、正規品でないことが判明した場合は、商品代金を全額返金いたします。
          </p>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">返金について</h2>
          <p className="text-gray-600">
            返品が確認でき次第、ご購入時のお支払い方法に応じて返金いたします。
            クレジットカード決済の場合は、カード会社を通じて返金されます。
            返金までに1〜2週間程度かかる場合がございます。
          </p>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">返品・交換の手順</h2>
          <ol className="list-decimal pl-6 text-gray-600">
            <li className="mb-2">
              まずは、メールまたはお電話にてご連絡ください。
            </li>
            <li className="mb-2">
              当社より返送先住所と返送方法をご案内いたします。
            </li>
            <li className="mb-2">
              商品を梱包し、ご返送ください。
            </li>
            <li className="mb-2">
              商品到着後、状態を確認の上、返金または交換商品を発送いたします。
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">お問い合わせ先</h2>
          <p className="text-gray-600">
            返品・交換に関するお問い合わせは、下記までご連絡ください。
          </p>
          <p className="text-gray-600 mt-2">
            メール: info@maison.k-honest.com<br />
            電話: 03-4500-3763（平日 10:00〜18:00）
          </p>
        </section>
      </div>
    </div>
  );
}
