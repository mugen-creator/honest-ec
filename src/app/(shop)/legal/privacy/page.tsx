export const metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
      <h1 className="font-serif-jp text-3xl font-medium tracking-wide text-center mb-12">
        プライバシーポリシー
      </h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <p className="text-gray-600">
          株式会社Honest-Maison（以下「当社」といいます）は、お客様の個人情報の保護を重要な責務と認識し、
          以下のとおりプライバシーポリシーを定め、これを遵守いたします。
        </p>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">1. 個人情報の定義</h2>
          <p className="text-gray-600">
            個人情報とは、氏名、住所、電話番号、メールアドレス等、特定の個人を識別できる情報をいいます。
          </p>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">2. 個人情報の収集</h2>
          <p className="text-gray-600">
            当社は、以下の場合に個人情報を収集いたします。
          </p>
          <ul className="list-disc pl-6 text-gray-600 mt-2">
            <li>会員登録をされる場合</li>
            <li>商品をご購入される場合</li>
            <li>お問い合わせをされる場合</li>
            <li>アンケートにご回答いただく場合</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">3. 個人情報の利用目的</h2>
          <p className="text-gray-600">
            収集した個人情報は、以下の目的で利用いたします。
          </p>
          <ul className="list-disc pl-6 text-gray-600 mt-2">
            <li>商品の発送およびお届けに関するご連絡</li>
            <li>ご注文内容の確認およびお問い合わせへの対応</li>
            <li>新商品やセール情報等のご案内（同意いただいた方のみ）</li>
            <li>サービス改善のための統計データの作成</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">4. 個人情報の第三者提供</h2>
          <p className="text-gray-600">
            当社は、以下の場合を除き、お客様の個人情報を第三者に提供いたしません。
          </p>
          <ul className="list-disc pl-6 text-gray-600 mt-2">
            <li>お客様の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>配送業者への配送情報の提供</li>
            <li>決済代行会社への決済情報の提供</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">5. 個人情報の管理</h2>
          <p className="text-gray-600">
            当社は、個人情報の漏洩、滅失、毀損等を防止するため、適切な安全管理措置を講じます。
          </p>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">6. 個人情報の開示・訂正・削除</h2>
          <p className="text-gray-600">
            お客様ご本人から個人情報の開示、訂正、削除のご請求があった場合は、
            本人確認の上、速やかに対応いたします。
          </p>
        </section>

        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4">7. お問い合わせ</h2>
          <p className="text-gray-600">
            個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。
          </p>
          <p className="text-gray-600 mt-2">
            株式会社Honest-Maison 個人情報担当<br />
            メール: privacy@honest-maison.com<br />
            電話: 03-XXXX-XXXX（平日 10:00〜18:00）
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          制定日: 2024年○月○日<br />
          最終改定日: 2024年○月○日
        </p>
      </div>
    </div>
  );
}
