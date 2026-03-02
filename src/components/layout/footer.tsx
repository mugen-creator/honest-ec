import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold tracking-wider mb-4">
              Honest<span className="text-amber-500">-</span>Maison
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              厳選された高級ブランド品を、
              <br />
              誠実な価格でお届けします。
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white text-sm transition-colors">
                  全商品
                </Link>
              </li>
              <li>
                <Link href="/products?category=watches" className="text-gray-400 hover:text-white text-sm transition-colors">
                  時計
                </Link>
              </li>
              <li>
                <Link href="/products?category=bags" className="text-gray-400 hover:text-white text-sm transition-colors">
                  バッグ
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-gray-400 hover:text-white text-sm transition-colors">
                  アクセサリー
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  会社概要
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-400 hover:text-white text-sm transition-colors">
                  ご利用ガイド
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/tokushoho" className="text-gray-400 hover:text-white text-sm transition-colors">
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/legal/returns" className="text-gray-400 hover:text-white text-sm transition-colors">
                  返品・交換について
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Honest-Maison. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              古物商許可番号: 第○○○○○○○○号
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
