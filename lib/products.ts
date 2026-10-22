import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { lists, type Item } from "@/lib/lists";
import { priceView, unitPrice } from "@/lib/orders";
import { groupStock, soldOutOf } from "@/lib/stock";
import { PER_PAGE, type SortKey } from "@/lib/categories";

export type ListResult = { items: Item[]; total: number; pages: number };
type Opts = { sub?: string; sort?: SortKey; page?: number };

// 카테고리 → 상품 조건. 모든 상품은 WOMEN에 들어가고, BEST·NEW는 관리자가 표시한 상품입니다.
// (예전에 category가 best/new로 저장된 상품도 계속 보이게 합니다.)
function categoryWhere(slug: string): Prisma.ProductWhereInput {
  if (slug === "best") return { OR: [{ category: "best" }, { inBest: true }] };
  if (slug === "new") return { OR: [{ category: "new" }, { inNew: true }] };
  return { category: slug };
}

const priceOf = (i: Item) => Number(i.price.replace(/\D/g, "")) || 0;

// DB에서 카테고리별 상품을 읽어 분류 필터, 정렬, 페이지를 적용합니다.
// DB가 연결되지 않았거나 상품이 하나도 없으면 lib/lists.ts의 샘플 데이터를 보여줍니다.
export async function getListProducts(slug: string, { sub, sort = "new", page = 1 }: Opts = {}): Promise<ListResult> {
  const samples = (): ListResult => {
    let all = sub ? [] : [...(lists[slug]?.items ?? [])]; // 샘플에는 하위 분류가 없습니다.
    if (sort === "priceAsc") all = all.sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === "priceDesc") all = all.sort((a, b) => priceOf(b) - priceOf(a));
    const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    const cur = Math.min(Math.max(1, page), pages);
    return { items: all.slice((cur - 1) * PER_PAGE, cur * PER_PAGE), total: all.length, pages };
  };
  if (!process.env.DATABASE_URL) return samples();

  try {
    const where: Prisma.ProductWhereInput = sub ? { AND: [categoryWhere(slug), { subCategory: sub }] } : categoryWhere(slug);
    const rows = await prisma.product.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 500 });
    if (rows.length === 0) return sub ? { items: [], total: 0, pages: 1 } : samples();

    let ordered = rows; // 기본: 신상품순 (최근에 등록한 상품이 먼저)
    if (sort === "popular") {
      // 인기순: 취소하지 않은 주문에서 많이 팔린 순서
      const sold = new Map<number | null, number>();
      try {
        const groups = await prisma.orderItem.groupBy({ by: ["productId"], where: { productId: { in: rows.map((r) => r.id) }, order: { status: { not: "CANCELED" } } }, _sum: { quantity: true } });
        for (const g of groups) sold.set(g.productId, g._sum.quantity ?? 0);
      } catch (e) {
        console.error("인기순 집계 실패:", e);
      }
      ordered = [...rows].sort((a, b) => (sold.get(b.id) ?? 0) - (sold.get(a.id) ?? 0));
    } else if (sort === "priceAsc") {
      ordered = [...rows].sort((a, b) => unitPrice(a) - unitPrice(b)); // 할인가 기준
    } else if (sort === "priceDesc") {
      ordered = [...rows].sort((a, b) => unitPrice(b) - unitPrice(a));
    }

    const pages = Math.max(1, Math.ceil(ordered.length / PER_PAGE));
    const cur = Math.min(Math.max(1, page), pages);
    const slice = ordered.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
    // 품절 표시용 재고 (재고 테이블이 아직 없어도 목록은 보이게 합니다)
    const stocks = groupStock(await prisma.productStock.findMany({ where: { productId: { in: slice.map((r) => r.id) } } }).catch(() => []));
    const items: Item[] = slice.map((r) => ({
      id: r.id,
      soldOut: r.soldOut || soldOutOf(stocks.get(r.id) ?? {}),
      name: r.name,
      ...priceView(r.price, r.sale),
      bg: r.bg,
      sale: r.sale ?? undefined,
      imageUrl: r.imageUrl ?? undefined,
    }));
    return { items, total: ordered.length, pages };
  } catch (e) {
    console.error("DB 조회에 실패해 샘플 데이터로 대신합니다:", e);
    return samples();
  }
}

// 메인 화면 등에서 쓰는 간단한 목록 (첫 페이지)
export async function getProducts(slug: string): Promise<Item[]> {
  return (await getListProducts(slug)).items;
}
