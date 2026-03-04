import { CreditCard, Truck, Shield, MessageSquare } from "lucide-react";

export const metadata = {
  title: "ご利用ガイド",
};

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
      <h1 className="font-serif-jp text-3xl font-medium tracking-wide text-center mb-12">ご利用ガイド</h1>

      <div className="space-y-12">
        {/* お買い物の流れ */}
        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-600" />
            お買い物の流れ
          </h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <h3 className="font-bold mb-1">商品を選ぶ</h3>
                <p className="text-gray-600 text-sm">
                  気になる商品をクリックして、詳細をご確認ください。
                  商品の状態や付属品などを十分にご確認の上、「カートに入れる」ボタンをクリックしてください。
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <h3 className="font-bold mb-1">カートを確認</h3>
                <p className="text-gray-600 text-sm">
                  カートに入れた商品を確認し、「ご注文手続きへ」ボタンをクリックしてください。
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <h3 className="font-bold mb-1">会員登録・ログイン</h3>
                <p className="text-gray-600 text-sm">
                  初めてのお客様は会員登録をお願いいたします。
                  すでに会員の方はログインしてください。
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                4
              </span>
              <div>
                <h3 className="font-bold mb-1">お届け先・お支払い</h3>
                <p className="text-gray-600 text-sm">
                  配送先情報を入力し、お支払い方法を選択してください。
                  内容を確認の上、「注文を確定する」ボタンをクリックしてください。
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                5
              </span>
              <div>
                <h3 className="font-bold mb-1">注文完了</h3>
                <p className="text-gray-600 text-sm">
                  ご注文完了メールをお送りいたします。
                  発送準備が整い次第、発送完了メールにて追跡番号をお知らせいたします。
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* お支払い方法 */}
        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-600" />
            お支払い方法
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">クレジットカード</h3>
              <p className="text-gray-600 text-sm mb-4">
                VISA、Mastercard、JCB、American Expressがご利用いただけます。
              </p>
              <p className="text-gray-500 text-xs">
                ※お支払いは一括払いのみとなります。<br />
                ※決済はStripeの安全なシステムを利用しております。<br />
                ※カード情報は当社では保持いたしません。
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">銀行振込</h3>
              <p className="text-gray-600 text-sm mb-4">
                ご注文後7日以内にお振込みください。
                入金確認後、商品を発送いたします。
              </p>
              <p className="text-gray-500 text-xs">
                ※振込先口座は注文完了画面およびメールにてお知らせいたします。<br />
                ※振込手数料はお客様負担となります。
              </p>
            </div>
          </div>
        </section>

        {/* 配送について */}
        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-6 flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-600" />
            配送について
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">送料</h3>
              <p className="text-gray-600 text-sm">全国送料無料</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">配送業者</h3>
              <p className="text-gray-600 text-sm">
                ヤマト運輸（宅急便）にてお届けいたします。
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">お届け日数</h3>
              <p className="text-gray-600 text-sm">
                ご注文確定後、3〜5営業日以内に発送いたします。<br />
                お届け日時は、発送完了メールに記載の追跡番号にてご確認ください。
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">梱包</h3>
              <p className="text-gray-600 text-sm">
                高級品を安全にお届けするため、丁寧に梱包いたします。<br />
                外装には商品名やブランド名は記載いたしません。
              </p>
            </div>
          </div>
        </section>

        {/* お問い合わせ */}
        <section>
          <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-600" />
            お問い合わせ
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600 text-sm mb-4">
              商品に関するご質問や、ご購入前のご相談など、お気軽にお問い合わせください。
            </p>
            <dl className="grid grid-cols-[80px,1fr] gap-y-2 text-sm">
              <dt className="text-gray-500">電話</dt>
              <dd>03-4500-3763（平日 10:00〜18:00）</dd>
              <dt className="text-gray-500">メール</dt>
              <dd>info@maison.k-honest.com</dd>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
