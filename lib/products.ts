import type { Prisma, Product } from "@prisma/client";
import { prisma } from "@/lib/db";
import { lists, type Item } from "@/lib/lists";
import { priceView, unitPrice } from "@/lib/orders";
import { groupStock, soldOutOf } from "@/lib/stock";
import { PER_PAGE, type SortKey } from "@/lib/categories";

export type ListResult = { items: Item[]; total: number; pages: number; failed?: boolean };
type Opts = { sub?: string; sort?: SortKey; page?: number; perPage?: number };

// 카테고리 → 상품 조건. 모든 상품은 WOMEN에 들어가고, BEST·NEW는 관리자가 표시한 상품입니다.
// (예전에 category가 best/new로 저장된 상품도 계속 보이게 합니다.)
function categoryWhere(slug: string): Prisma.ProductWhereInput {
  if (slug === "best") return { OR: [{ category: "best" }, { inBest: true }] };
  if (slug === "new") return { OR: [{ category: "new" }, { inNew: true }] };
  return { category: slug };
}

const NEWEST: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: "desc" }, { id: "desc" }];

// DB에서 카테고리별 상품을 읽어 분류 필터, 정렬, 페이지를 적용합니다.
// 기본(신상품순)은 DB에서 필요한 한 페이지만 가져오고, 인기순·가격순은 후보를 읽어 정렬합니다.
export async function getListProducts(slug: string, { sub, sort = "new", page = 1, perPage = PER_PAGE }: Opts = {}): Promise<ListResult> {
  if (!lists[slug] || !process.env.DATABASE_URL) return { items: [], total: 0, pages: 1, failed: !process.env.DATABASE_URL };
  try {
    const where: Prisma.ProductWhereInput = sub ? { AND: [categoryWhere(slug), { subCategory: sub }] } : categoryWhere(slug);
    const clampPage = (total: number) => Math.min(Math.max(1, page), Math.max(1, Math.ceil(total / perPage)));
    let rows: Product[];
    let total: number;

    if (sort === "new") {
      total = await prisma.product.count({ where });
      rows = await prisma.product.findMany({ where, orderBy: NEWEST, skip: (clampPage(total) - 1) * perPage, take: perPage });
    } else {
      const all = await prisma.product.findMany({ where, orderBy: NEWEST, take: 500 });
      let ordered = all;
      if (sort === "popular") {
        // 인기순: 취소하지 않은 주문에서 많이 팔린 순서
        const sold = new Map<number | null, number>();
        try {
          const groups = await prisma.orderItem.groupBy({ by: ["productId"], where: { productId: { in: all.map((r) => r.id) }, order: { status: { not: "CANCELED" } } }, _sum: { quantity: true } });
          for (const g of groups) sold.set(g.productId, g._sum.quantity ?? 0);
        } catch (e) {
          console.error("인기순 집계 실패:", e);
        }
        ordered = [...all].sort((a, b) => (sold.get(b.id) ?? 0) - (sold.get(a.id) ?? 0));
      } else {
        // 가격순은 할인가 기준
        ordered = [...all].sort((a, b) => (sort === "priceAsc" ? unitPrice(a) - unitPrice(b) : unitPrice(b) - unitPrice(a)));
      }
      total = ordered.length;
      rows = ordered.slice((clampPage(total) - 1) * perPage, clampPage(total) * perPage);
    }

    // 품절 표시용 재고 (재고 테이블이 아직 없어도 목록은 보이게 합니다)
    const stocks = groupStock(rows.length ? await prisma.productStock.findMany({ where: { productId: { in: rows.map((r) => r.id) } } }).catch(() => []) : []);
    const items: Item[] = rows.map((r) => ({
      id: r.id,
      soldOut: r.soldOut || soldOutOf(stocks.get(r.id) ?? {}),
      name: r.name,
      ...priceView(r.price, r.sale),
      bg: r.bg,
      sale: r.sale ?? undefined,
      imageUrl: r.imageUrl ?? undefined,
    }));
    return { items, total, pages: Math.max(1, Math.ceil(total / perPage)) };
  } catch (e) {
    console.error("상품 목록 조회 실패:", e);
    return { items: [], total: 0, pages: 1, failed: true };
  }
}
