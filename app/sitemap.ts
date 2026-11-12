import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/site";

// 검색 사이트에 알려 주는 페이지 목록입니다. (상품은 DB에서 읽습니다)
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const fixed = ["", "/list/women", "/list/best", "/list/new", "/about", "/notice", "/faq", "/qna", "/review", "/shipping-return", "/terms", "/privacy"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 }));
  try {
    const [products, notices] = await Promise.all([
      prisma.product.findMany({ select: { id: true, createdAt: true }, orderBy: { id: "desc" }, take: 5000 }),
      prisma.notice.findMany({ select: { id: true, createdAt: true }, orderBy: { id: "desc" }, take: 200 }),
    ]);
    return [
      ...fixed,
      ...products.map((p) => ({ url: `${base}/product/${p.id}`, lastModified: p.createdAt, changeFrequency: "weekly" as const, priority: 0.8 })),
      ...notices.map((n) => ({ url: `${base}/notice/${n.id}`, lastModified: n.createdAt, changeFrequency: "monthly" as const, priority: 0.3 })),
    ];
  } catch (e) {
    console.error("사이트맵 만들기 실패:", e);
    return fixed;
  }
}
