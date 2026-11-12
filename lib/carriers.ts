// 택배사 목록과 배송 추적 링크. 추적은 무료 배송 조회 서비스(tracker.delivery)로 연결합니다.
export const CARRIERS = [
  { name: "CJ대한통운", id: "kr.cjlogistics", keys: ["cj", "대한통운"] },
  { name: "한진택배", id: "kr.hanjin", keys: ["한진"] },
  { name: "롯데택배", id: "kr.lotte", keys: ["롯데"] },
  { name: "우체국택배", id: "kr.epost", keys: ["우체국"] },
  { name: "로젠택배", id: "kr.logen", keys: ["로젠"] },
  { name: "경동택배", id: "kr.kdexp", keys: ["경동"] },
  { name: "대신택배", id: "kr.daesin", keys: ["대신"] },
  { name: "CU편의점택배", id: "kr.cupost", keys: ["cu"] },
  { name: "GS25편의점택배", id: "kr.cvsnet", keys: ["gs"] },
];

// 택배사 이름과 운송장 번호로 추적 주소를 만듭니다. 택배사를 알 수 없으면 null
export function trackingUrl(carrier: string | null | undefined, trackingNumber: string | null | undefined): string | null {
  if (!carrier || !trackingNumber) return null;
  const c = carrier.replace(/\s/g, "").toLowerCase();
  const found = CARRIERS.find((x) => x.keys.some((k) => c.includes(k)));
  const no = trackingNumber.replace(/[^0-9A-Za-z]/g, "");
  return found && no ? `https://tracker.delivery/#/${found.id}/${no}` : null;
}
