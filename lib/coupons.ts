// 쿠폰 계산 규칙 (화면과 서버가 같은 규칙을 씁니다)
export type CouponLike = { kind: string; value: number; minOrder: number; active?: boolean; expiresAt?: Date | null };

export const couponText = (c: { kind: string; value: number }) => (c.kind === "PERCENT" ? `${c.value}%` : `${c.value.toLocaleString("ko-KR")}원`);

// 상품금액에서 깎아 주는 금액 (정률은 내림, 정액은 상품금액을 넘지 않게)
export function couponDiscount(c: { kind: string; value: number }, itemsTotal: number) {
  return c.kind === "PERCENT" ? Math.floor((itemsTotal * Math.min(100, c.value)) / 100) : Math.min(c.value, itemsTotal);
}

export const couponUsable = (c: CouponLike, itemsTotal: number, now = new Date()) =>
  c.active !== false && (!c.expiresAt || c.expiresAt > now) && itemsTotal >= c.minOrder;
