export type Item = { id?: number; name: string; price: string; bg: string; sale?: string; imageUrl?: string; soldOut?: boolean; finalPrice?: string };
export type ListConfig = { title: string; sub: string; chips: string[]; items: Item[] };

const G = "#e6e3de", B = "#ddd8d0", D = "#d6d6d6", L = "#dcdcdc";
const base = ["전체", "아우터", "상의", "하의", "셋업", "신발 / 악세서리"];

export const lists: Record<string, ListConfig> = {
  best: {
    title: "BEST", sub: "지금 가장 많이 선택되는 아이템", chips: base,
    items: [
      { name: "부클 벨티드 코트", price: "₩276,000", bg: G },
      { name: "데님 셔츠", price: "₩145,000", bg: B },
      { name: "퍼 트림 후드 집업", price: "₩193,000", bg: G },
      { name: "밀리터리 셋업", price: "₩119,000", bg: B },
      { name: "스트라이프 가디건 세트", price: "₩118,000", bg: G },
      { name: "레이어드 니트", price: "₩89,000", bg: B },
      { name: "오프숄더 스카프 스웨터", price: "₩142,000", bg: G },
      { name: "트림 가디건 세트", price: "₩130,000", bg: B },
    ],
  },
  new: {
    title: "NEW", sub: "새로 들어온 상품", chips: base,
    items: [
      { name: "벨티드 코트", price: "₩276,000", bg: G },
      { name: "퍼 트림 후드 집업", price: "₩193,000", bg: B },
      { name: "데님 셔츠", price: "₩145,000", bg: B },
      { name: "밀리터리 셋업", price: "₩119,000", bg: G },
      { name: "레이어드 니트", price: "₩89,000", bg: B },
    ],
  },
  women: {
    title: "WOMEN", sub: "여성 컬렉션", chips: ["전체", "아우터", "상의", "하의", "드레스", "셋업", "신발 / 악세서리"],
    items: [
      ["부클 벨티드 코트", "₩276,000"], ["퍼 트림 후드 집업", "₩193,000"], ["스카프 오프숄더 니트", "₩142,000"], ["레이어드 셔츠 드레스", "₩129,000"],
      ["플리츠 미디 스커트", "₩105,000"], ["가디건 세트", "₩130,000"], ["레더 와이드 팬츠", "₩179,000"], ["하이넥 니트 탑", "₩99,000"],
    ].map(([name, price], i) => ({ name, price, bg: i % 2 ? B : G })),
  },
};
