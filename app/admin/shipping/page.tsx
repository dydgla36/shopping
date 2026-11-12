import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { importTracking, saveShipping } from "@/app/actions/shipping";
import { CARRIERS } from "@/lib/carriers";
import { STATUS_LABEL, fmtDate, itemOption } from "@/lib/orders";
import { bodyRow, btnDark, h2, headRow, input, notice } from "../styles";

export const maxDuration = 60; // 발송 메일을 많이 보낼 때를 위해 최대 60초까지 기다립니다.
const cols = "150px 1fr 120px 150px 160px";

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string; failed?: string }> }) {
  await requireAdmin("/admin/shipping");
  const sp = await searchParams;
  const orders = await prisma.order.findMany({ where: { status: { in: ["PAID", "PREPARING"] } }, orderBy: { createdAt: "asc" }, take: 200, include: { items: true } });
  return (
    <>
      <h2 style={h2}>운송장 일괄 입력</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: "#767676" }}>결제 완료·배송 준비 중인 주문 {orders.length}건이에요. 운송장 번호를 적은 주문만 &quot;발송 중&quot;으로 바뀌고, 고객에게 발송 메일(이메일 서비스 설정 시)이 가요.</p>
      {sp.saved && <div style={notice(true)} role="status">{sp.saved}건을 발송 처리했어요.</div>}
      {sp.failed && <div style={notice(false)} role="alert">처리하지 못한 항목: {sp.failed} (없는 주문이거나 이미 발송된 주문, 또는 입력 형식 오류)</div>}

      <form action={saveShipping} style={{ marginTop: 20 }}>
        <label style={{ fontSize: 13 }}>기본 택배사 (줄마다 고르지 않았을 때 씁니다)
          <select name="defaultCarrier" defaultValue={CARRIERS[0]?.name} style={{ ...input, marginLeft: 8, width: 200 }}>
            {CARRIERS.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </label>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <div style={{ minWidth: 760, borderTop: "1px solid #111" }}>
            <div style={headRow(cols)}><span>주문번호</span><span>받는 분 · 상품</span><span>상태</span><span>택배사</span><span>운송장 번호</span></div>
            {orders.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>발송할 주문이 없어요.</div>}
            {orders.map((o) => (
              <div key={o.id} style={bodyRow(cols)}>
                <span style={{ fontSize: 12 }}><input type="hidden" name="no" value={o.orderNumber} /><Link href={`/admin/orders/${o.orderNumber}`} style={{ borderBottom: "1px solid #ccc" }}>{o.orderNumber}</Link><br /><span style={{ color: "#767676" }}>{fmtDate(o.createdAt)}</span></span>
                <span style={{ fontSize: 13 }}>{o.recipientName}<br /><span style={{ color: "#767676" }}>{o.items.map((i) => `${i.name}${itemOption(i) ? `(${itemOption(i)})` : ""} x${i.quantity}`).join(", ")}</span></span>
                <span style={{ fontSize: 13 }}>{STATUS_LABEL[o.status] ?? o.status}</span>
                <select name={`carrier:${o.orderNumber}`} defaultValue="" aria-label={`${o.orderNumber} 택배사`} style={input}>
                  <option value="">기본 택배사</option>
                  {CARRIERS.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <input name={`tracking:${o.orderNumber}`} inputMode="numeric" placeholder="운송장 번호" aria-label={`${o.orderNumber} 운송장 번호`} style={input} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
          <button type="submit" style={btnDark}>운송장 저장 · 발송 처리</button>
          {orders.length > 0 && <a href="/admin/print?status=ship" target="_blank" rel="noopener noreferrer" style={{ borderBottom: "1px solid #111", fontSize: 13 }}>이 주문들의 주문서·송장 인쇄</a>}
        </div>
      </form>

      <h3 style={{ margin: "40px 0 0", font: "800 16px Archivo,'Noto Sans KR',sans-serif" }}>한꺼번에 붙여넣기</h3>
      <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: "#767676" }}>엑셀에서 &quot;주문번호, 택배사, 운송장번호&quot; 세 칸을 복사해 붙여넣으세요. (쉼표 또는 탭으로 구분, 한 줄에 주문 하나)</p>
      <form action={importTracking} style={{ maxWidth: 560 }}>
        <textarea name="lines" rows={6} placeholder={"G20260101-12345, CJ대한통운, 123456789012"} aria-label="붙여넣기" style={{ ...input, marginTop: 8, resize: "vertical" }} />
        <button type="submit" style={{ ...btnDark, marginTop: 10 }}>붙여넣은 내용 저장</button>
      </form>
    </>
  );
}
