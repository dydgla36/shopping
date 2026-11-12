import { prisma } from "@/lib/db";
import { CARD_SELECT } from "@/lib/products";
import { priceView } from "@/lib/orders";
import { groupStock, soldOutOf } from "@/lib/stock";

// 상품 번호 목록(?ids=1,2,3)으로 카드에 필요한 정보를 돌려줍니다. (최근 본 상품 화면이 씁니다)
export async function GET(req: Request) {
  const ids = (new URL(req.url).searchParams.get("ids") ?? "").split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 12);
  if (ids.length === 0) return Response.json({ items: [] });
  try {
    const rows = await prisma.product.findMany({ where: { id: { in: ids } }, select: CARD_SELECT });
    const stocks = groupStock(await prisma.productStock.findMany({ where: { productId: { in: ids } } }).catch(() => []));
    const byId = new Map(rows.map((r) => [r.id, r]));
    const items = ids.flatMap((id) => {
      const r = byId.get(id);
      return r ? [{ id: r.id, name: r.name, ...priceView(r.price, r.sale), bg: r.bg, sale: r.sale ?? undefined, imageUrl: r.imageUrl ?? undefined, soldOut: r.soldOut || soldOutOf(stocks.get(r.id) ?? {}, r.sizes) }] : [];
    });
    return Response.json({ items }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("최근 본 상품 조회 실패:", e);
    return Response.json({ items: [] });
  }
}
