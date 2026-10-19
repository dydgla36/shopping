import { prisma } from "@/lib/db";
import { CHECKOUT_ITEMS } from "@/lib/orders";

export type Line = { name: string; price: number; quantity: number; color: string | null; size: string | null; bg: string; productId: number | null };
export const SIZES = ["S", "M", "L"];

const samples: Line[] = CHECKOUT_ITEMS.map((i) => ({ ...i, productId: null }));

// 주문/결제에 올릴 상품 목록.
// - 상품 상세에서 BUY NOW로 오면: 그 상품 하나 (이름·가격은 DB 값)
// - 그 밖에는: 기존 샘플 상품 2개 (장바구니가 아직 DB에 없어서)
// 상품을 찾을 수 없으면 null을 돌려줍니다.
export async function resolveLines(p: { product?: string; size?: string; qty?: string }): Promise<Line[] | null> {
  if (!p.product) return samples;
  const id = Number(p.product);
  if (!Number.isInteger(id)) return null;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  const quantity = Math.min(10, Math.max(1, Math.floor(Number(p.qty)) || 1));
  const size = p.size && SIZES.includes(p.size) ? p.size : null;
  return [{ name: product.name, price: product.price, quantity, color: null, size, bg: product.bg, productId: product.id }];
}
