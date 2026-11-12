// 상품 상세 내용(글·이미지)과 사이즈표. DB에는 JSON 글자로 저장하고, 읽을 때 안전하게 해석합니다.
export type DetailBlock = { t: "text" | "image"; v: string };
export type SizeChart = { columns: string[]; rows: { size: string; values: string[] }[]; note: string };

export const MAX_DETAIL_BLOCKS = 40;
export const MAX_DETAIL_IMAGES = 20;
export const MAX_CHART_COLUMNS = 8;
export const MAX_CHART_ROWS = 12;

export function parseDetail(raw: string | null | undefined): DetailBlock[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((b): DetailBlock[] => {
      const x = b as { t?: unknown; v?: unknown };
      return (x?.t === "text" || x?.t === "image") && typeof x.v === "string" && x.v ? [{ t: x.t, v: x.v }] : [];
    });
  } catch {
    return [];
  }
}

export const detailImages = (raw: string | null | undefined) => parseDetail(raw).filter((b) => b.t === "image").map((b) => b.v);

export function parseSizeChart(raw: string | null | undefined): SizeChart | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as { columns?: unknown; rows?: unknown; note?: unknown };
    if (!Array.isArray(d.columns) || !Array.isArray(d.rows)) return null;
    const columns = d.columns.map((c) => String(c ?? ""));
    const rows = d.rows.map((r) => {
      const x = r as { size?: unknown; values?: unknown };
      const values = Array.isArray(x.values) ? x.values.map((v) => String(v ?? "")) : [];
      return { size: String(x.size ?? ""), values: columns.map((_, i) => values[i] ?? "") };
    });
    return columns.length > 0 && rows.length > 0 ? { columns, rows, note: typeof d.note === "string" ? d.note : "" } : null;
  } catch {
    return null;
  }
}
