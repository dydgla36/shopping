// 상품 색상 옵션. 저장 형태는 "이름|#색상코드" 입니다. (예: "아이보리|#f2ecdf")
export type ColorOption = { name: string; hex: string };
export const MAX_COLORS = 8;

export function parseColors(values: string[]): ColorOption[] {
  return values
    .map((v) => {
      const [name, hex] = v.split("|");
      return { name: (name ?? "").trim(), hex: /^#[0-9a-fA-F]{6}$/.test(hex ?? "") ? (hex as string) : "#cccccc" };
    })
    .filter((c) => c.name);
}

export const serializeColor = (c: ColorOption) => `${c.name}|${c.hex}`;

// 고른 색상이 그 상품의 옵션인지 확인합니다.
// 색상이 없는 상품은 빈 값(""), 있는 상품은 그중 하나여야 하고, 맞지 않으면 null입니다.
export function pickColor(options: string[], chosen: string): string | null {
  const names = parseColors(options).map((c) => c.name);
  if (names.length === 0) return "";
  return names.includes(chosen) ? chosen : null;
}
