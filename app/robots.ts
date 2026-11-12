import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// 검색 로봇에게 알려 주는 규칙: 로그인·주문·관리자 화면은 검색에 나오지 않게 합니다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/cart", "/checkout", "/mypage", "/order-complete", "/order-detail", "/guest-order", "/order-lookup", "/login", "/signup", "/profile-edit", "/addresses", "/wishlist", "/points", "/coupons", "/claims", "/reset-password", "/find-id", "/find-pw"] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
