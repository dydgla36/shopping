"use client";

import { useState } from "react";
import { MAX_CHART_COLUMNS, MAX_CHART_ROWS, parseSizeChart } from "@/lib/productContent";

const small = { padding: "6px 10px", border: "1px solid #ccc", background: "#fff", color: "#111", cursor: "pointer", fontSize: 12 } as const;
const cellInput = { width: "100%", boxSizing: "border-box", minWidth: 64, padding: "8px 6px", border: "1px solid #ccc", font: "400 13px 'Noto Sans KR',sans-serif", textAlign: "center" } as const;
const PRESETS: Record<string, string[]> = {
  상의: ["어깨너비", "가슴단면", "소매길이", "총장"],
  하의: ["허리단면", "엉덩이단면", "허벅지단면", "밑위", "총장"],
  원피스: ["어깨너비", "가슴단면", "허리단면", "총장"],
  신발: ["발길이", "굽높이"],
};
type Row = { size: string; values: string[] };

// 사이즈표 편집기: 항목(예: 어깨너비)과 사이즈별 숫자를 표로 입력합니다. 비워 두면 상품 페이지에 사이즈표가 보이지 않아요.
export default function SizeChartEditor({ initial, sizes }: { initial: string | null; sizes: string[] }) {
  const init = parseSizeChart(initial);
  const [columns, setColumns] = useState<string[]>(init?.columns ?? []);
  const [rows, setRows] = useState<Row[]>(init?.rows ?? []);
  const [note, setNote] = useState(init?.note ?? "");

  const fit = (r: Row, cols: number): Row => ({ size: r.size, values: Array.from({ length: cols }, (_, i) => r.values[i] ?? "") });
  function applyPreset(name: string) {
    const cols = PRESETS[name] as string[];
    setColumns(cols);
    setRows((cur) => cur.map((r) => fit(r, cols.length)));
  }
  // 상품에서 정한 사이즈로 행을 맞춥니다. (이미 적은 숫자는 같은 사이즈 행에 그대로 남아요)
  const fillSizes = () => setRows(sizes.map((s) => fit(rows.find((r) => r.size === s) ?? { size: s, values: [] }, columns.length)));
  const setCell = (ri: number, ci: number, v: string) => setRows((cur) => cur.map((r, n) => (n === ri ? { ...r, values: r.values.map((x, k) => (k === ci ? v : x)) } : r)));
  const addColumn = () => {
    setColumns((c) => [...c, ""]);
    setRows((cur) => cur.map((r) => ({ ...r, values: [...r.values, ""] })));
  };
  const removeColumn = (ci: number) => {
    setColumns((c) => c.filter((_, n) => n !== ci));
    setRows((cur) => cur.map((r) => ({ ...r, values: r.values.filter((_, n) => n !== ci) })));
  };

  const valid = columns.some((c) => c.trim()) && rows.some((r) => r.size.trim());
  const json = valid ? JSON.stringify({ columns, rows, note }) : "";

  return (
    <fieldset style={{ border: 0, padding: 0, margin: "18px 0 0", fontSize: 12, color: "#767676" }}>
      <legend style={{ padding: 0 }}>사이즈표 (선택) — 상품 상세 페이지의 교환·반품 안내 아래에 표로 보여요. 단위는 cm 기준이에요.</legend>
      <input type="hidden" name="sizeChart" value={json} />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
        <span>양식 불러오기</span>
        {Object.keys(PRESETS).map((name) => <button key={name} type="button" onClick={() => applyPreset(name)} style={small}>{name}</button>)}
        <button type="button" onClick={fillSizes} style={small}>상품 사이즈로 행 채우기</button>
      </div>
      {columns.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: 4, color: "#111" }}>사이즈</th>
                {columns.map((c, ci) => (
                  <th key={ci} style={{ padding: 4 }}>
                    <input value={c} maxLength={12} placeholder="항목" aria-label={`항목 ${ci + 1} 이름`} onChange={(e) => setColumns((cur) => cur.map((x, n) => (n === ci ? e.target.value : x)))} style={{ ...cellInput, fontWeight: 700 }} />
                    <button type="button" onClick={() => removeColumn(ci)} aria-label={`항목 ${ci + 1} 삭제`} style={{ ...small, marginTop: 4, padding: "2px 8px", color: "#c0392b" }}>×</button>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>
                  <td style={{ padding: 4 }}><input value={r.size} maxLength={10} placeholder="예: M" aria-label={`${ri + 1}번째 행 사이즈`} onChange={(e) => setRows((cur) => cur.map((x, n) => (n === ri ? { ...x, size: e.target.value } : x)))} style={{ ...cellInput, fontWeight: 700 }} /></td>
                  {columns.map((_, ci) => (
                    <td key={ci} style={{ padding: 4 }}><input value={r.values[ci] ?? ""} maxLength={12} inputMode="decimal" aria-label={`${r.size || ri + 1} ${columns[ci] || ci + 1}`} onChange={(e) => setCell(ri, ci, e.target.value)} style={cellInput} /></td>
                  ))}
                  <td style={{ padding: 4 }}><button type="button" onClick={() => setRows((cur) => cur.filter((_, n) => n !== ri))} aria-label={`${ri + 1}번째 행 삭제`} style={{ ...small, color: "#c0392b" }}>행 삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        <button type="button" onClick={addColumn} disabled={columns.length >= MAX_CHART_COLUMNS} style={small}>+ 항목(열) 추가</button>
        <button type="button" onClick={() => setRows((cur) => (cur.length >= MAX_CHART_ROWS ? cur : [...cur, fit({ size: "", values: [] }, columns.length)]))} disabled={rows.length >= MAX_CHART_ROWS} style={small}>+ 사이즈(행) 추가</button>
      </div>
      <label style={{ display: "block", marginTop: 10 }}>표 아래 안내 문구 (비우면 기본 문구가 보여요)
        <input value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} placeholder="예: 모델 키 168cm, M 사이즈 착용" style={{ display: "block", width: "100%", boxSizing: "border-box", marginTop: 6, padding: 10, border: "1px solid #ccc", font: "400 14px 'Noto Sans KR',sans-serif" }} />
      </label>
    </fieldset>
  );
}
