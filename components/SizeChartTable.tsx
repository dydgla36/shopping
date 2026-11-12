import { parseSizeChart } from "@/lib/productContent";

// 사이즈표. 관리자가 상품 관리에서 입력한 표를 보여줍니다. 표가 없으면 아무것도 보이지 않습니다.
export default function SizeChartTable({ raw }: { raw: string | null }) {
  const chart = parseSizeChart(raw);
  if (!chart) return null;
  const cell = { padding: "12px 10px", borderBottom: "1px solid #eee", textAlign: "center", fontSize: 13, whiteSpace: "nowrap" } as const;
  return (
    <div>
      <div style={{ overflowX: "auto", marginTop: 16 }}>
        <table style={{ width: "100%", minWidth: 360, borderCollapse: "collapse", borderTop: "1px solid #111" }}>
          <thead>
            <tr>
              <th style={{ ...cell, background: "#f7f3ef", fontWeight: 700 }}>사이즈</th>
              {chart.columns.map((c, i) => <th key={i} style={{ ...cell, background: "#f7f3ef", fontWeight: 700 }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((r, n) => (
              <tr key={n}>
                <th style={{ ...cell, fontWeight: 700 }}>{r.size}</th>
                {r.values.map((v, i) => <td key={i} style={cell}>{v || "-"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 12, lineHeight: 1.7, color: "#767676" }}>{chart.note || "단위: cm · 재는 방법에 따라 1~3cm 정도 차이가 있을 수 있어요."}</p>
    </div>
  );
}
