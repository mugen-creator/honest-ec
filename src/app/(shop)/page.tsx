import Link from "next/link";
import { ArrowRight, Shield, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] lg:h-[80vh] bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920')`,
          }}
        />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h2 className="text-white text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
              本物だけを、
              <br />
              誠実な価格で。
            </h2>
            <p className="text-gray-200 text-lg lg:text-xl mb-8">
              厳選された高級ブランド品・時計を、
              <br className="hidden sm:block" />
              確かな鑑定と安心の保証でお届けします。
            </p>
            <Link href="/products">
              <Button size="lg" variant="secondary" className="group">
                商品を見る
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-amber-50 rounded-full">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">正規品保証</h3>
              <p className="text-gray-600 text-sm">
                熟練の鑑定士が全商品を厳しく検査。
                <br />
                安心してお買い求めいただけます。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-amber-50 rounded-full">
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">全国送料無料</h3>
              <p className="text-gray-600 text-sm">
                日本全国どこでも送料無料。
                <br />
                丁寧な梱包で安全にお届けします。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-amber-50 rounded-full">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">アフターサポート</h3>
              <p className="text-gray-600 text-sm">
                ご購入後も安心のサポート体制。
                <br />
                修理・メンテナンスのご相談も承ります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            SHOP
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {/* New Arrivals */}
            <Link
              href="/products?sort=newest"
              className="group relative h-64 overflow-hidden bg-gray-900"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800')`,
                }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-lg lg:text-xl font-bold tracking-wider">NEW ARRIVALS</h3>
                  <p className="text-gray-200 text-sm mt-1">新着商品</p>
                </div>
              </div>
            </Link>

            {/* Ranking */}
            <Link
              href="/ranking"
              className="group relative h-64 overflow-hidden bg-gray-900"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800')`,
                }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-lg lg:text-xl font-bold tracking-wider">RANKING</h3>
                  <p className="text-gray-200 text-sm mt-1">人気ランキング</p>
                </div>
              </div>
            </Link>

            {/* Brands */}
            <Link
              href="/brands"
              className="group relative h-64 overflow-hidden bg-gray-900"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800')`,
                }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-lg lg:text-xl font-bold tracking-wider">BRANDS</h3>
                  <p className="text-gray-200 text-sm mt-1">ブランド一覧</p>
                </div>
              </div>
            </Link>

            {/* Category */}
            <Link
              href="/categories"
              className="group relative h-64 overflow-hidden bg-gray-900"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800')`,
                }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-lg lg:text-xl font-bold tracking-wider">CATEGORY</h3>
                  <p className="text-gray-200 text-sm mt-1">カテゴリー一覧</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            会員登録で特別なお知らせを
          </h2>
          <p className="text-gray-400 mb-8">
            新着商品やセール情報をいち早くお届けします。
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              無料会員登録
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
