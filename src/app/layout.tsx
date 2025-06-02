import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalUp",
  description: "로컬업 홈페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
