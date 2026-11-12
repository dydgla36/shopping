"use client";

export default function PrintButton() {
  return (
    <button type="button" className="no-print" onClick={() => window.print()} style={{ padding: "12px 24px", background: "#111", color: "#fff", border: 0, cursor: "pointer", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
      인쇄하기
    </button>
  );
}
