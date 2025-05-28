import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gengoka - 言語化トレーニングアプリ",
  description: "あなたの言葉が、意図通りに相手を動かす力を持つ。AIによる実践的な練習とパーソナルなフィードバックを通じて、ビジネスコミュニケーション能力を向上させましょう。",
  keywords: ["ビジネスコミュニケーション", "言語化", "文章添削", "AI", "学習"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased h-full bg-gradient-to-br from-blue-50 to-indigo-100`}
      >
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
