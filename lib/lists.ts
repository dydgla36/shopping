// 카테고리 화면의 제목과 설명. (상품은 모두 DB에서 읽습니다.)
export type Item = { id: number; name: string; price: string; bg: string; sale?: string; imageUrl?: string; soldOut?: boolean; finalPrice?: string };
export type ListConfig = { title: string; sub: string };

export const lists: Record<string, ListConfig> = {
  best: { title: "BEST", sub: "지금 가장 많이 선택되는 아이템" },
  new: { title: "NEW", sub: "새로 들어온 상품" },
  women: { title: "WOMEN", sub: "여성 컬렉션" },
};
