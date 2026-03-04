import type { Metadata } from "next";
import { Noto_Sans_JP, Shippori_Mincho, Playfair_Display } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

// 本文用 - 読みやすいゴシック
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// 日本語見出し用 - エレガントな明朝体
const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// 英語見出し・ロゴ用 - クラシックセリフ
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Export for use in components
export const fonts = {
  playfair: playfair.className,
  shippori: shipporiMincho.className,
};

export const metadata: Metadata = {
  title: {
    default: "Honest-Maison | 高級ブランド品・時計専門店",
    template: "%s | Honest-Maison",
  },
  description:
    "Honest-Maisonは、厳選された高級ブランド品・時計を誠実な価格でお届けするオンラインショップです。全品正規品保証・送料無料。",
  keywords: ["高級時計", "ブランド品", "中古時計", "ロレックス", "エルメス", "ルイヴィトン"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${shipporiMincho.variable} ${playfair.variable} font-sans antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
