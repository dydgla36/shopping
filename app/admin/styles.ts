import type { CSSProperties } from "react";

export const h2: CSSProperties = { margin: 0, font: "800 22px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".04em" };
export const card: CSSProperties = { flex: "1 1 170px", padding: 24, background: "#f4f2ee" };
export const cardLabel: CSSProperties = { fontSize: 12, color: "#767676" };
export const cardValue: CSSProperties = { marginTop: 8, font: "800 26px Archivo,sans-serif" };
export const headRow = (cols: string): CSSProperties => ({ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "14px 12px", borderBottom: "1px solid #e5e5e5", font: "700 12px 'Noto Sans KR',sans-serif", color: "#767676" });
export const bodyRow = (cols: string): CSSProperties => ({ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "16px 12px", borderBottom: "1px solid #e5e5e5", fontSize: 14, alignItems: "center" });
export const input: CSSProperties = { boxSizing: "border-box", padding: "10px 12px", border: "1px solid #ccc", font: "400 14px 'Noto Sans KR',sans-serif", width: "100%", background: "#fff" };
export const btnDark: CSSProperties = { padding: "10px 18px", background: "#111", color: "#fff", border: 0, cursor: "pointer", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" };
export const btnLine: CSSProperties = { ...btnDark, background: "#fff", color: "#111", border: "1px solid #111" };
export const chip = (on: boolean): CSSProperties => ({ padding: "8px 14px", border: `1px solid ${on ? "#111" : "#ccc"}`, background: on ? "#111" : undefined, color: on ? "#fff" : undefined, font: "500 13px 'Noto Sans KR',sans-serif" });
export const notice = (ok: boolean): CSSProperties => ({ margin: "16px 0 0", padding: "12px 16px", fontSize: 13, background: ok ? "#eef6ee" : "#fbeeee", color: ok ? "#2d6a2d" : "#c0392b" });
