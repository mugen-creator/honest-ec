import type { Metadata } from "next";
import { Noto_Sans_JP, Cormorant_Garamond } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
        className={`${notoSansJP.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
