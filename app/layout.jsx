import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const notoSansJP = Noto_Sans_JP({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: 'swap',
});

export const metadata = {
  title: "Fil Atelier - かぎ針編みハンドメイドショップ",
  description: "Fil Atelier（フィル・アトリエ）は、かぎ針編みで作られたハンドメイド作品のオンラインショップ。編みぐるみ、小物など、心のこもった作品をお届けします。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} antialiased`}
        style={{ fontFamily: 'var(--font-noto-sans-jp)' }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

