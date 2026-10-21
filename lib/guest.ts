import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const newGuestToken = () => randomBytes(16).toString("hex");
export const digits = (v: string) => v.replace(/\D/g, "");

// 비회원 주문 조회 토큰 비교 (시간 차이로 알아낼 수 없도록 비교합니다)
export function tokenOk(a?: string | null, b?: string | null) {
  if (!a || !b || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// 이름+전화번호로 조회했을 때 주는 "제한된" 토큰. 비밀 토큰에서 한 방향으로만 만들 수 있어서,
// 제한된 토큰으로는 전체 정보를 볼 수 있는 토큰을 알아낼 수 없습니다.
export const limitedToken = (guestToken: string) => createHash("sha256").update(`${guestToken}:lookup`).digest("hex").slice(0, 32);
