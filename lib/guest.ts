import { randomBytes, timingSafeEqual } from "node:crypto";

export const newGuestToken = () => randomBytes(16).toString("hex");
export const digits = (v: string) => v.replace(/\D/g, "");

// 비회원 주문 조회 토큰 비교 (시간 차이로 알아낼 수 없도록 비교합니다)
export function tokenOk(a?: string | null, b?: string | null) {
  if (!a || !b || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
