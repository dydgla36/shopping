import { prisma } from "@/lib/db";
import { unitPrice } from "@/lib/orders";

export type Line = { name: string; price: number; quantity: number; color: string | null; size: string | null; bg: string; productId: number | null };
export const SIZES = ["S", "M", "L"];

// 주문/결제에 올릴 상품 목록.
// - 상품 상세에서 BUY NOW로 오면: 그 상품 하나 (이름·가격은 DB 값)
// - 장바구니에서 오면: 장바구니에 담은 상품 전체
// 상품을 찾을 수 없으면 null을 돌려줍니다.
export async function resolveLines(p: { product?: string; size?: string; qty?: string; cart?: boolean; userId?: number }): Promise<Line[] | null> {
  // 장바구니에서 주문: 로그인한 회원의 장바구니 전체 (이름·가격은 DB 값)
  if (p.cart) {
    if (!p.userId) return null;
    const items = await prisma.cartItem.findMany({ where: { userId: p.userId }, include: { product: true }, orderBy: { id: "asc" } });
    if (items.length === 0) return null;
    return items.map((i) => ({ name: i.product.name, price: unitPrice(i.product), quantity: i.quantity, color: null, size: i.size, bg: i.product.bg, productId: i.productId }));
  }
  if (!p.product) return null;
  const id = Number(p.product);
  if (!Number.isInteger(id)) return null;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  const quantity = Math.min(10, Math.max(1, Math.floor(Number(p.qty)) || 1));
  const size = p.size && SIZES.includes(p.size) ? p.size : null;
  return [{ name: product.name, price: unitPrice(product), quantity, color: null, size, bg: product.bg, productId: product.id }];
}
