import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import ScrollTop from "@/components/ScrollTop";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GABBY", template: "%s | GABBY" },
  description: "GABBY 패션 쇼핑몰",
  metadataBase: new URL(siteUrl()),
  openGraph: { siteName: "GABBY", locale: "ko_KR", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&family=Cormorant+Garamond:wght@500;600&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Marquee />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ScrollTop />
        <ChatButton />
      </body>
    </html>
  );
}
