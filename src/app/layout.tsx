import type { Metadata } from "next";
import "./globals.css";
import { config } from "@/config";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Providers } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "로컬업(LocalUp) - 관광 데이터로 만드는 우리 가게 성공 스토리",
  description: "AI가 분석하는 실시간 관광 트렌드로 매출을 높이세요. 전국 관광지 자영업자를 위한 데이터 기반 경영 지원 플랫폼",
  keywords: "로컬업, LocalUp, 관광데이터, 자영업, AI분석, 매출증대, 경영지원",
  authors: [{ name: "LocalUp Team" }],
  creator: "LocalUp",
  publisher: "LocalUp",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: config.siteUrl,
    title: "로컬업(LocalUp) - 관광 데이터로 만드는 우리 가게 성공 스토리",
    description: "AI가 분석하는 실시간 관광 트렌드로 매출을 높이세요",
    siteName: "LocalUp",
  },
  twitter: {
    card: "summary_large_image",
    title: "로컬업(LocalUp)",
    description: "AI가 분석하는 실시간 관광 트렌드로 매출을 높이세요",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Providers>
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
