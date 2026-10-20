import type { CSSProperties } from "react";

export const crumb: CSSProperties = { padding: "24px 60px 0", fontSize: 12, color: "#767676" };
export const pageWrap: CSSProperties = { padding: "20px 60px 0" };
export const h1: CSSProperties = { margin: 0, font: "800 40px Archivo,sans-serif", letterSpacing: ".04em" };
export const subtitle: CSSProperties = { margin: "10px 0 0", fontSize: 14, color: "#555" };
export const narrow = (max = 520): CSSProperties => ({ maxWidth: max, margin: "0 auto", padding: "72px 24px 0" });
export const narrowTitle: CSSProperties = { margin: 0, textAlign: "center", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" };
export const headRow = (cols: string): CSSProperties => ({ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "14px 12px", borderBottom: "1px solid #e5e5e5", font: "700 12px 'Noto Sans KR',sans-serif", color: "#767676" });
export const bodyRow = (cols: string): CSSProperties => ({ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: 14, alignItems: "center" });
export const chip = (on: boolean): CSSProperties => ({ padding: "10px 18px", border: `1px solid ${on ? "#111" : "#ccc"}`, background: on ? "#111" : undefined, color: on ? "#fff" : undefined, font: "500 13px 'Noto Sans KR',sans-serif" });
export const darkBtn: CSSProperties = { display: "inline-block", padding: "12px 24px", background: "#111", color: "#fff", border: 0, cursor: "pointer", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" };
export const lineBtn: CSSProperties = { ...darkBtn, background: "#fff", color: "#111", border: "1px solid #111" };
export const box: CSSProperties = { padding: 28, background: "#f4f2ee" };
export const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
