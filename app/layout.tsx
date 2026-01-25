import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Everything AI | 深度拆解万物运作逻辑",
    template: "%s | Everything AI",
  },
  description: "面向下一代思想者的深度知识探索平台。利用 AI 技术拆解万物原理，将复杂知识视觉化，开启理性远征。",
  keywords: ["AI", "科学探索", "知识拆解", "青少年教育", "技术原理", "Everything AI"],
  authors: [{ name: "Everything AI Collective" }],
  creator: "Everything AI Collective",
  publisher: "Everything AI Collective",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Everything AI | 深度拆解万物运作逻辑",
    description: "面向下一代思想者的深度知识探索平台。利用 AI 技术拆解万物原理，将复杂知识视觉化。",
    url: "https://everything-ai.example.com",
    siteName: "Everything AI",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Everything AI | 深度拆解万物运作逻辑",
    description: "面向下一代思想者的深度知识探索平台。利用 AI 技术拆解万物原理。",
    creator: "@everything_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
