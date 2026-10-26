// 엑셀에서 열 수 있는 CSV를 만듭니다. (한글이 깨지지 않도록 맨 앞에 BOM을 붙여 보냅니다)
type Cell = string | number | boolean | null | undefined;

function cell(v: Cell) {
  if (v === null || v === undefined) return "";
  let s = String(v);
  // 엑셀 수식으로 실행될 수 있는 글자(=, +, -, @)로 시작하는 글은 앞에 '를 붙여 일반 글자로 만듭니다. (숫자는 그대로)
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const toCsv = (rows: Cell[][]) => "\uFEFF" + rows.map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";

// 한국 시간 "2026-01-31 14:05:09"
export const kstDateTime = (d: Date) => new Date(d.getTime() + 9 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 19);
