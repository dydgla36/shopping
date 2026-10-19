export type Item = { id?: number; name: string; price: string; bg: string; sale?: string; imageUrl?: string };
export type ListConfig = { title: string; sub: string; chips: string[]; items: Item[] };

const G = "#e6e3de", B = "#ddd8d0", D = "#d6d6d6", L = "#dcdcdc";
const base = ["전체", "아우터", "상의", "하의", "셋업", "신발 / 악세서리"];

export const lists: Record<string, ListConfig> = {
  best: {
    title: "BEST", sub: "지금 가장 많이 선택되는 아이템", chips: base,
    items: [
      { name: "부클 벨티드 코트", price: "₩276,000", bg: G },
      { name: "데님 셔츠", price: "₩145,000", bg: B },
      { name: "퍼 트림 후드 집업", price: "₩193,000", bg: G, sale: "7%" },
      { name: "밀리터리 셋업", price: "₩119,000", bg: B },
      { name: "레더 재킷", price: "₩194,000", bg: D, sale: "7%" },
      { name: "헨리넥 니트", price: "₩80,000", bg: L, sale: "7%" },
      { name: "와이드 팬츠", price: "₩101,000", bg: D },
      { name: "후디드 봄버", price: "₩205,000", bg: L },
      { name: "스트라이프 가디건 세트", price: "₩118,000", bg: G },
      { name: "레이어드 니트", price: "₩89,000", bg: B },
      { name: "오프숄더 스카프 스웨터", price: "₩142,000", bg: G },
      { name: "트림 가디건 세트", price: "₩130,000", bg: B },
    ],
  },
  new: {
    title: "NEW · 7%", sub: "신상품 7% 할인 · 3일 한정", chips: ["전체", "WOMEN", "MEN"],
    items: [
      { name: "벨티드 코트", price: "₩276,000", bg: G, sale: "7%" },
      { name: "퍼 트림 후드 집업", price: "₩193,000", bg: B, sale: "7%" },
      { name: "레더 재킷", price: "₩194,000", bg: D, sale: "7%" },
      { name: "헨리넥 니트", price: "₩80,000", bg: D, sale: "7%" },
      { name: "데님 셔츠", price: "₩145,000", bg: B, sale: "7%" },
      { name: "밀리터리 셋업", price: "₩119,000", bg: G, sale: "7%" },
      { name: "와이드 팬츠", price: "₩101,000", bg: D, sale: "7%" },
      { name: "레이어드 니트", price: "₩89,000", bg: B, sale: "7%" },
    ],
  },
  men: {
    title: "MEN", sub: "남성 컬렉션", chips: base,
    items: [
      ["레더 재킷", "₩194,000"], ["봄버 재킷", "₩205,000"], ["블레이저", "₩158,000"], ["헨리넥 니트", "₩80,000"],
      ["오버핏 셔츠", "₩98,000"], ["카고 팬츠", "₩89,000"], ["와이드 슬랙스", "₩101,000"], ["후디", "₩79,000"],
    ].map(([name, price]) => ({ name, price, bg: D })),
  },
  women: {
    title: "WOMEN", sub: "여성 컬렉션", chips: ["전체", "아우터", "상의", "하의", "드레스", "셋업", "신발 / 악세서리"],
    items: [
      ["부클 벨티드 코트", "₩276,000"], ["퍼 트림 후드 집업", "₩193,000"], ["스카프 오프숄더 니트", "₩142,000"], ["레이어드 셔츠 드레스", "₩129,000"],
      ["플리츠 미디 스커트", "₩105,000"], ["가디건 세트", "₩130,000"], ["레더 와이드 팬츠", "₩179,000"], ["하이넥 니트 탑", "₩99,000"],
    ].map(([name, price], i) => ({ name, price, bg: i % 2 ? B : G })),
  },
};
