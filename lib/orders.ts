export const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

export const STATUS_LABEL: Record<string, string> = {
  PENDING: "주문 접수",
  PAID: "결제 완료",
  PREPARING: "배송 준비",
  SHIPPING: "배송 중",
  DELIVERED: "배송 완료",
  CANCELED: "취소",
};

// 한국 시간 기준 YYYY.MM.DD
export function fmtDate(d: Date) {
  const parts = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(d)
    .reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  return `${parts.year}.${parts.month}.${parts.day}`;
}

export const itemOption = (i: { color?: string | null; size?: string | null }) =>
  [i.color && `COLOR ${i.color}`, i.size && `SIZE ${i.size}`].filter(Boolean).join(" / ");

// 장바구니는 아직 DB에 저장되지 않아서, 주문/결제 화면에 보이는 상품 2개를 그대로 주문합니다.
// 가격은 브라우저가 보낸 값이 아니라 여기(서버)의 값으로 계산합니다.
export const CHECKOUT_ITEMS = [
  { name: "부클 벨티드 코트", price: 276000, quantity: 1, color: "아이보리", size: "M", bg: "#e6e3de" },
  { name: "데님 셔츠", price: 145000, quantity: 1, color: "인디고", size: "S", bg: "#ddd8d0" },
];
export const SHIPPING_FEE = 0;
export const DISCOUNT = 0;
