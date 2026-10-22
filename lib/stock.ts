import { prisma } from "@/lib/db";
import { SIZES } from "@/lib/checkout";

export const LOW_STOCK = 3; // 이 수량 이하면 "재고 부족"으로 보여줍니다.

// 재고 행이 있는 사이즈만 들어 있습니다. 없는 사이즈는 재고를 관리하지 않는 것(무제한)입니다.
export type StockMap = Record<string, number>;

// 모든 사이즈가 품절(0)이면 상품 전체가 품절입니다.
export const soldOutOf = (m: StockMap) => SIZES.every((s) => m[s] === 0);

export function groupStock(rows: { productId: number; size: string; quantity: number }[]) {
  const by = new Map<number, StockMap>();
  for (const r of rows) by.set(r.productId, { ...(by.get(r.productId) ?? {}), [r.size]: r.quantity });
  return by;
}

export async function stockMap(productId: number): Promise<StockMap> {
  const rows = await prisma.productStock.findMany({ where: { productId } });
  return Object.fromEntries(rows.map((r) => [r.size, r.quantity]));
}

// 그 사이즈의 남은 수량. 재고를 관리하지 않으면 undefined(무제한).
export async function availableFor(productId: number, size: string): Promise<number | undefined> {
  try {
    // 관리자가 품절로 표시한 상품은 재고와 상관없이 0개입니다.
    const product = await prisma.product.findUnique({ where: { id: productId }, select: { soldOut: true } });
    if (product?.soldOut) return 0;
    const row = await prisma.productStock.findUnique({ where: { productId_size: { productId, size } } });
    return row?.quantity;
  } catch (e) {
    console.error("재고 조회 실패:", e);
    return undefined;
  }
}
