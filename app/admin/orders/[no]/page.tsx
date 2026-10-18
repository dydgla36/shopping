import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { updateOrder } from "@/app/actions/admin";
import { STATUS_LABEL, fmtDate, itemOption, won } from "@/lib/orders";
import { btnDark, h2, input, notice } from "../../styles";

const line = { display: "flex", justifyContent: "space-between", gap: 20, padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: 14 } as const;
const Row = ({ a, b }: { a: string; b: React.ReactNode }) => (
  <div style={line}><span style={{ color: "#767676", flexShrink: 0 }}>{a}</span><span style={{ textAlign: "right" }}>{b}</span></div>
);
const Title = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginTop: 36, paddingBottom: 14, borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif" }}>{children}</div>
);

export default async function Page({ params, searchParams }: { params: Promise<{ no: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { no: raw } = await params;
  const no = decodeURIComponent(raw);
  const sp = await searchParams;
  await requireAdmin(`/admin/orders/${raw}`);

  const order = await prisma.order.findUnique({ where: { orderNumber: no }, include: { items: true, user: true } });
  if (!order) notFound();

  return (
    <>
      <Link href="/admin/orders" style={{ fontSize: 13, color: "#767676" }}>← 주문 목록</Link>
      <h2 style={{ ...h2, marginTop: 12 }}>{order.orderNumber}</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#767676" }}>주문일 {fmtDate(order.createdAt)}</p>
      {sp.saved && <div style={notice(true)} role="status">저장했어요.</div>}
      {sp.error && <div style={notice(false)} role="alert">{sp.error}</div>}

      <Title>배송 처리</Title>
      <form action={updateOrder} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 18, alignItems: "end" }}>
        <input type="hidden" name="orderNumber" value={order.orderNumber} />
        <label style={{ fontSize: 12, color: "#767676" }}>주문 상태
          <select name="status" defaultValue={order.status} style={{ ...input, marginTop: 6 }}>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label style={{ fontSize: 12, color: "#767676" }}>택배사
          <input name="carrier" defaultValue={order.carrier ?? ""} placeholder="예: [택배사]" style={{ ...input, marginTop: 6 }} />
        </label>
        <label style={{ fontSize: 12, color: "#767676" }}>운송장 번호
          <input name="trackingNumber" defaultValue={order.trackingNumber ?? ""} placeholder="운송장 번호" style={{ ...input, marginTop: 6 }} />
        </label>
        <button type="submit" style={btnDark}>SAVE</button>
      </form>

      <Title>배송 정보</Title>
      <Row a="수령인" b={order.recipientName} />
      <Row a="연락처" b={order.recipientPhone} />
      <Row a="주소" b={`${order.address}${order.addressDetail ? ` ${order.addressDetail}` : ""}`} />
      <Row a="배송 메모" b={order.deliveryMemo ?? "-"} />

      <Title>주문 상품</Title>
      {order.items.map((it) => (
        <div key={it.id} style={{ ...line, padding: "16px 0" }}>
          <div>
            <div>{it.name}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: "#767676" }}>{[itemOption(it), `수량 ${it.quantity}`].filter(Boolean).join(" / ")}</div>
          </div>
          <b style={{ fontFamily: "Archivo,sans-serif" }}>{won(it.price * it.quantity)}</b>
        </div>
      ))}

      <Title>주문자 · 결제 정보</Title>
      <Row a="주문자" b={`${order.ordererName} (${order.user.loginId})`} />
      <Row a="연락처" b={order.ordererPhone} />
      <Row a="이메일" b={order.ordererEmail} />
      <Row a="결제 수단" b={order.paymentMethod} />
      <Row a="상품금액" b={won(order.itemsTotal)} />
      <Row a="배송비" b={won(order.shippingFee)} />
      <Row a="할인 금액" b={won(order.discount)} />
      <div style={{ ...line, borderBottom: 0, fontWeight: 700 }}><span>총 결제금액</span><span style={{ font: "800 20px Archivo,sans-serif" }}>{won(order.total)}</span></div>
    </>
  );
}
