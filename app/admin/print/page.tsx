import PrintButton from "@/components/PrintButton";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { BUSINESS } from "@/lib/business";
import { fmtDateTime, fullAddress, itemOption } from "@/lib/orders";

export const metadata = { title: "주문서 인쇄" };

// 주문서·송장 인쇄: 주문 하나가 한 장입니다. (?nos=주문번호,주문번호 또는 ?status=ship)
export default async function Page({ searchParams }: { searchParams: Promise<{ nos?: string; status?: string }> }) {
  await requireAdmin("/admin/print");
  const sp = await searchParams;
  const nos = (sp.nos ?? "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, 100);
  const orders = await prisma.order.findMany({
    where: nos.length > 0 ? { orderNumber: { in: nos } } : sp.status === "ship" ? { status: { in: ["PAID", "PREPARING"] } } : { id: -1 },
    orderBy: { createdAt: "asc" },
    take: 100,
    include: { items: true },
  });
  const cell = { padding: "8px 6px", borderBottom: "1px solid #bbb", fontSize: 13, textAlign: "left" } as const;
  return (
    <>
      <div className="no-print" style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
        <PrintButton />
        <span style={{ fontSize: 13, color: "#767676" }}>주문서 {orders.length}장 · 주문 하나가 한 장으로 인쇄돼요.</span>
      </div>
      {orders.length === 0 && <p style={{ marginTop: 20, fontSize: 14, color: "#767676" }}>인쇄할 주문이 없어요.</p>}
      {orders.map((o) => (
        <div key={o.id} className="slip" style={{ marginTop: 20, padding: 24, border: "1px solid #111" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}><b style={{ fontSize: 18 }}>{o.orderNumber}</b><span>{fmtDateTime(o.createdAt)}</span></div>
          <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse" }}>
            <tbody>
              <tr><th style={{ ...cell, width: 90 }}>받는 분</th><td style={cell}><b style={{ fontSize: 16 }}>{o.recipientName}</b> · {o.recipientPhone}</td></tr>
              <tr><th style={cell}>주소</th><td style={{ ...cell, fontSize: 15 }}>{fullAddress(o)}</td></tr>
              <tr><th style={cell}>배송 메모</th><td style={cell}>{o.deliveryMemo ?? "-"}</td></tr>
              <tr><th style={cell}>보내는 분</th><td style={cell}>{BUSINESS.name} · {BUSINESS.csPhone}</td></tr>
            </tbody>
          </table>
          <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse" }}>
            <thead><tr><th style={cell}>상품</th><th style={cell}>옵션</th><th style={{ ...cell, width: 60 }}>수량</th><th style={{ ...cell, width: 50 }}>확인</th></tr></thead>
            <tbody>
              {o.items.map((i) => (
                <tr key={i.id}><td style={cell}>{i.name}</td><td style={cell}>{itemOption(i) || "-"}</td><td style={cell}><b>{i.quantity}</b></td><td style={cell}>□</td></tr>
              ))}
            </tbody>
          </table>
          {o.adminMemo && <p style={{ margin: "12px 0 0", fontSize: 12, color: "#555" }}>메모: {o.adminMemo}</p>}
        </div>
      ))}
    </>
  );
}
