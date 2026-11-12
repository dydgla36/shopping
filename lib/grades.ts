// 회원 등급: 배송 완료된 주문의 누적 구매 금액(배송비 제외)으로 정합니다. 기준과 적립률은 여기에서 바꿉니다.
export const GRADES = [
  { name: "일반", min: 0, rate: 0.01 },
  { name: "실버", min: 300000, rate: 0.015 },
  { name: "골드", min: 1000000, rate: 0.02 },
];

export const gradeFor = (spent: number) => [...GRADES].reverse().find((g) => spent >= g.min) ?? (GRADES[0] as (typeof GRADES)[number]);
export const nextGrade = (spent: number) => GRADES.find((g) => g.min > spent) ?? null;
export const ratePercent = (rate: number) => `${+(rate * 100).toFixed(1)}%`;
