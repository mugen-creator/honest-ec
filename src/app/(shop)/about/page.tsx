import { Shield, Award, Users } from "lucide-react";

export const metadata = {
  title: "会社概要",
  description: "Honest-Maisonの会社概要です。",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
      <h1 className="font-serif-jp text-3xl font-medium tracking-wide text-center mb-12">会社概要</h1>

      {/* Mission */}
      <section className="mb-16">
        <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4 border-b pb-2">私たちの想い</h2>
        <p className="text-gray-600 leading-relaxed">
          Honest-Maisonは「本物だけを、誠実な価格で」をモットーに、
          お客様に信頼いただけるブランド品・高級時計専門店を目指しております。
          経験豊富な鑑定士による厳格な品質管理のもと、
          安心してお買い物いただける環境を整えております。
        </p>
      </section>

      {/* Features */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-amber-50 rounded-full">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-bold mb-2">正規品保証</h3>
            <p className="text-sm text-gray-600">
              すべての商品を熟練の鑑定士が厳しく検査。
              万が一、正規品でない場合は全額返金いたします。
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-amber-50 rounded-full">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-bold mb-2">確かな実績</h3>
            <p className="text-sm text-gray-600">
              創業以来、多くのお客様にご愛顧いただいております。
              リピーター率90%以上を誇ります。
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-amber-50 rounded-full">
              <Users className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-bold mb-2">充実のサポート</h3>
            <p className="text-sm text-gray-600">
              ご購入後も安心のアフターサポート。
              修理・メンテナンスのご相談も承ります。
            </p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section>
        <h2 className="font-serif-jp text-xl font-medium tracking-wide mb-4 border-b pb-2">会社情報</h2>
        <dl className="grid grid-cols-[120px,1fr] gap-y-4 text-sm">
          <dt className="text-gray-500">会社名</dt>
          <dd>合同会社Honest</dd>

          <dt className="text-gray-500">所在地</dt>
          <dd>〒169-0072 東京都新宿区大久保2丁目19-15 サンフォレスト405号室</dd>

          <dt className="text-gray-500">代表者</dt>
          <dd>代表社員 町田 強平</dd>

          <dt className="text-gray-500">設立</dt>
          <dd>2024年5月（令和6年5月）</dd>

          <dt className="text-gray-500">事業内容</dt>
          <dd>高級ブランド品・時計の販売</dd>

          <dt className="text-gray-500">古物商許可</dt>
          <dd>東京都公安委員会 第304362420799号</dd>

          <dt className="text-gray-500">電話番号</dt>
          <dd>03-4500-3763（平日 10:00〜18:00）</dd>

          <dt className="text-gray-500">メール</dt>
          <dd>info@maison.k-honest.com</dd>
        </dl>
      </section>
    </div>
  );
}
