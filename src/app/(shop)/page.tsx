import Link from "next/link";
import { ArrowRight, Shield, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { HeroSlideshow } from "@/components/layout/hero-slideshow";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] lg:h-[80vh] bg-gray-900 overflow-hidden">
        <HeroSlideshow />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl px-4 animate-fade-in">
            <h2 className="font-serif-jp text-white text-4xl lg:text-6xl font-medium mb-6 tracking-wide leading-tight">
              本物だけを、
              <br />
              誠実な価格で。
            </h2>
            <p className="text-gray-200 text-lg lg:text-xl mb-8 tracking-wide">
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
          <AnimatedSection stagger className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-cyan-50 rounded-full">
                <Shield className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">正規品保証</h3>
              <p className="text-gray-600 text-sm">
                熟練の鑑定士が全商品を厳しく検査。
                <br />
                安心してお買い求めいただけます。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-cyan-50 rounded-full">
                <Truck className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">全国送料無料</h3>
              <p className="text-gray-600 text-sm">
                日本全国どこでも送料無料。
                <br />
                丁寧な梱包で安全にお届けします。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-cyan-50 rounded-full">
                <Award className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">アフターサポート</h3>
              <p className="text-gray-600 text-sm">
                ご購入後も安心のサポート体制。
                <br />
                修理・メンテナンスのご相談も承ります。
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-center mb-12 tracking-widest">
              SHOP
            </h2>
          </AnimatedSection>
          <AnimatedSection stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {/* New Arrivals */}
            <Link
              href="/products?sort=newest"
              className="group relative h-64 overflow-hidden bg-gray-900"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('/moncler.jpg')`,
                }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-display text-white text-lg lg:text-xl font-medium tracking-widest">NEW ARRIVALS</h3>
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
                  backgroundImage: `url('/daytona.webp')`,
                }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-display text-white text-lg lg:text-xl font-medium tracking-widest">RANKING</h3>
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
                  backgroundImage: `url('/hermes.webp')`,
                }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-display text-white text-lg lg:text-xl font-medium tracking-widest">BRANDS</h3>
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
                  backgroundImage: `url('/cartier.avif')`,
                }}
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-display text-white text-lg lg:text-xl font-medium tracking-widest">CATEGORY</h3>
                  <p className="text-gray-200 text-sm mt-1">カテゴリー一覧</p>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-cyan-800 text-white">
        <AnimatedSection className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif-jp text-2xl lg:text-3xl font-medium mb-4 tracking-wide">
            会員登録で特別なお知らせを
          </h2>
          <p className="text-gray-400 mb-8 tracking-wide">
            新着商品やセール情報をいち早くお届けします。
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              無料会員登録
            </Button>
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
