// 상품 사이즈 옵션. 상품마다 다를 수 있습니다. (예: S/M/L, FREE 하나만, 신발 230~280)
export const DEFAULT_SIZES = ["S", "M", "L"];
export const SIZE_PRESETS = ["FREE", "XS", "S", "M", "L", "XL", "XXL"];
export const MAX_SIZES = 10;

// 사이즈 목록 정리: 공백을 지우고, 같은 값은 하나만, 한 개당 10자 이하, 1~10개. 맞지 않으면 null
export function cleanSizes(values: string[]): string[] | null {
  const out: string[] = [];
  for (const raw of values) {
    const v = raw.trim();
    if (!v) continue;
    if (v.length > 10) return null;
    if (!out.includes(v)) out.push(v);
  }
  return out.length >= 1 && out.length <= MAX_SIZES ? out : null;
}

// 고른 사이즈가 그 상품의 사이즈인지 확인합니다. 사이즈가 하나뿐인 상품은 고르지 않아도 그 사이즈입니다. 맞지 않으면 null
export function pickSize(sizes: string[], chosen: string): string | null {
  if (sizes.includes(chosen)) return chosen;
  return sizes.length === 1 && !chosen ? (sizes[0] as string) : null;
}
