import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { won } from "@/lib/orders";

export const metadata = { title: "주문 완료" };

const rowStyle = { display: "flex", justifyContent: "space-between", gap: 20, padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: 14 } as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ no?: string }> }) {
  const { no } = await searchParams;
  const user = await requireUser(`/order-complete${no ? `?no=${no}` : ""}`);
  if (!no) notFound();

  // 로그인한 본인의 주문만 조회합니다.
  const order = await prisma.order.findFirst({ where: { orderNumber: no, userId: user.id }, include: { items: true } });
  if (!order) notFound();

  const first = order.items[0];
  const rest = order.items.length - 1;

  return (
    <section style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px 0", textAlign: "center" }}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="30" stroke="#111" strokeWidth="2" />
        <path d="M19 33l9 9 17-19" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h1 style={{ margin: "24px 0 0", font: "800 30px Archivo,'Noto Sans KR',sans-serif" }}>주문이 완료되었습니다</h1>
      <p style={{ margin: "12px 0 0", fontSize: 14, color: "#555", lineHeight: 1.7 }}>
        주문번호 <b>{order.orderNumber}</b>
        <br />
        주문 내역은 마이페이지에서 확인하실 수 있어요.
      </p>
      <div style={{ marginTop: 40, textAlign: "left", borderTop: "1px solid #111" }}>
        <div style={rowStyle}><span style={{ color: "#767676" }}>주문 상품</span><span>{first ? `${first.name}${rest > 0 ? ` 외 ${rest}건` : ""}` : "-"}</span></div>
        <div style={rowStyle}><span style={{ color: "#767676" }}>결제 수단</span><span>{order.paymentMethod}</span></div>
        <div style={rowStyle}><span style={{ color: "#767676" }}>배송지</span><span>{order.address}{order.addressDetail ? ` ${order.addressDetail}` : ""}</span></div>
        <div style={rowStyle}><span style={{ color: "#767676" }}>결제 금액</span><b style={{ fontFamily: "Archivo,sans-serif" }}>{won(order.total)}</b></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 36 }}>
        <Link className="btn" href={`/order-detail?no=${order.orderNumber}`} style={{ border: "1px solid #111" }}>ORDER DETAIL</Link>
        <Link className="btn" href="/" style={{ background: "#111", color: "#fff" }}>CONTINUE SHOPPING</Link>
      </div>
    </section>
  );
}
