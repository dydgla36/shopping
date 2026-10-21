import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GABBY", template: "%s | GABBY" },
  description: "GABBY 패션 쇼핑몰",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div style={{ width: "100%", maxWidth: 1440, margin: "0 auto", background: "#fff", color: "#111", fontFamily: "'Noto Sans KR',sans-serif" }}>
          <div style={{ background: "#111", color: "#fff", textAlign: "center", padding: "11px 16px", fontSize: 13 }}>
            카카오 간편 가입 시 5% 쿠폰 · 신상품 7% 할인 3일 한정
          </div>
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
