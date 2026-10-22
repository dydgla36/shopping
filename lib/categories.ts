// 상품 하위 분류 (관리자가 상품을 등록할 때 고르고, 카테고리 화면의 분류 버튼으로 쓰입니다)
export const SUB_CATEGORIES = ["아우터", "상의", "하의", "드레스", "셋업", "신발 / 악세서리"];

// 카테고리 화면의 정렬
export const SORTS = [
  ["new", "신상품순"],
  ["popular", "인기순"],
  ["priceAsc", "낮은가격순"],
  ["priceDesc", "높은가격순"],
] as const;
export type SortKey = (typeof SORTS)[number][0];

export const PER_PAGE = 12; // 한 페이지에 보여줄 상품 수
