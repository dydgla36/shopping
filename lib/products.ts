import { prisma } from "@/lib/db";
import { lists, type Item } from "@/lib/lists";
import { priceView } from "@/lib/orders";
import { groupStock, soldOutOf } from "@/lib/stock";

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

// DB에서 카테고리별 상품을 읽습니다.
// DB가 아직 연결되지 않았거나 비어 있으면 lib/lists.ts의 샘플 데이터를 보여줍니다.
export async function getProducts(slug: string): Promise<Item[]> {
  const fallback = lists[slug]?.items ?? [];
  if (!process.env.DATABASE_URL) return fallback;

  try {
    const rows = await prisma.product.findMany({
      where: { category: slug },
      orderBy: { position: "asc" },
    });
    if (rows.length === 0) return fallback;
    // 품절 표시용 재고 (재고 테이블이 아직 없어도 목록은 보이게 합니다)
    const stocks = groupStock(await prisma.productStock.findMany({ where: { productId: { in: rows.map((r) => r.id) } } }).catch(() => []));
    return rows.map((r) => ({ id: r.id, soldOut: soldOutOf(stocks.get(r.id) ?? {}), name: r.name, ...priceView(r.price, r.sale), bg: r.bg, sale: r.sale ?? undefined, imageUrl: r.imageUrl ?? undefined }));
  } catch (e) {
    console.error("DB 조회에 실패해 샘플 데이터로 대신합니다:", e);
    return fallback;
  }
}
