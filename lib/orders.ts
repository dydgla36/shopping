export const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

export const STATUS_LABEL: Record<string, string> = {
  PENDING: "입금 대기",
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

export const MAX_ADDRESSES = 10; // 저장할 수 있는 배송지 수
export const FREE_SHIPPING_MIN = 70000; // 상품금액(할인가 합계)이 이 금액 이상이면 배송비 무료
export const SHIPPING_FEE = 3000; // 무료 조건에 못 미칠 때의 기본 배송비
export const shippingFeeFor = (itemsTotal: number) => (itemsTotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE);
// 무료 배송까지 남은 금액 (이미 무료거나 담은 상품이 없으면 0)
export const untilFreeShipping = (itemsTotal: number) => (itemsTotal > 0 && itemsTotal < FREE_SHIPPING_MIN ? FREE_SHIPPING_MIN - itemsTotal : 0);
export const DISCOUNT = 0;

export const CLAIM_TYPE: Record<string, string> = { CANCEL: "취소", RETURN: "반품", EXCHANGE: "교환" };
export const CLAIM_STATUS: Record<string, string> = { RECEIVED: "접수", PROCESSING: "처리 중", DONE: "완료", REJECTED: "거절" };
export const EARN_REASON = "구매 적립";

// 우편번호가 있으면 앞에 붙여 보여줍니다.
export const fullAddress = (o: { postcode?: string | null; address: string; addressDetail?: string | null }) =>
  `${o.postcode ? `(${o.postcode}) ` : ""}${o.address}${o.addressDetail ? ` ${o.addressDetail}` : ""}`;

// ---- 할인율: 상품의 sale 값("7%")을 정가(price)에서 자동으로 깎습니다.
export function saleRate(sale?: string | null) {
  const m = /^\s*(\d{1,2})\s*%?\s*$/.exec(sale ?? "");
  const rate = m ? Number(m[1]) : 0;
  return rate >= 1 && rate <= 99 ? rate : 0;
}
// 할인가: 10원 단위 아래는 버립니다. 주문·장바구니의 실제 가격도 이 값을 씁니다.
export function unitPrice(p: { price: number; sale?: string | null }) {
  const rate = saleRate(p.sale);
  return rate ? Math.max(0, Math.floor((p.price * (100 - rate)) / 100 / 10) * 10) : p.price;
}
// 화면에 보여줄 정가(price)와 할인가(finalPrice, 할인 중일 때만)
export function priceView(price: number, sale?: string | null): { price: string; finalPrice?: string } {
  return saleRate(sale) ? { price: won(price), finalPrice: won(unitPrice({ price, sale })) } : { price: won(price) };
}

// ---- 후기 적립금: 20자 이상 후기 500원, 사진을 붙인 후기 1,000원
export const REVIEW_POINT = 500;
export const PHOTO_REVIEW_POINT = 1000;
export const REVIEW_POINT_MIN_LENGTH = 20;
export const REVIEW_REASON = "후기 적립";
export const MAX_REVIEW_PHOTOS = 3;

// 한국 시간 YYYY.MM.DD HH:mm
export function fmtDateTime(d: Date) {
  const p = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(d)
    .reduce<Record<string, string>>((acc, x) => {
      acc[x.type] = x.value;
      return acc;
    }, {});
  return `${p.year}.${p.month}.${p.day} ${p.hour}:${p.minute}`;
}
