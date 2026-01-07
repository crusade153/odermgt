import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar"; // 방금 만든 파일 import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Order Management System",
  description: "SAP Order Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex">
          {/* 사이드바 영역 (고정) */}
          <Sidebar />

          {/* 메인 콘텐츠 영역 (사이드바 너비 64만큼 왼쪽 여백 ml-64) */}
          <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}