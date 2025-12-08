import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fil Atelier - かぎ針編みハンドメイドショップ",
  description: "Fil Atelier（フィル・アトリエ）は、かぎ針編みで作られたハンドメイド作品のオンラインショップ。編みぐるみ、小物など、心のこもった作品をお届けします。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

