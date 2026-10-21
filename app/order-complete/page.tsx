import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { tokenOk } from "@/lib/guest";
import { fullAddress, won } from "@/lib/orders";

export const metadata = { title: "주문 완료" };

const rowStyle = { display: "flex", justifyContent: "space-between", gap: 20, padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: 14 } as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ no?: string; t?: string }> }) {
  const { no, t } = await searchParams;
  if (!no) notFound();
  const order = await prisma.order.findUnique({ where: { orderNumber: no }, include: { items: true } });
  if (!order) notFound();

  // 회원 주문은 본인만, 비회원 주문은 주문 완료 주소의 비밀 토큰이 맞을 때만 볼 수 있습니다.
  if (order.userId !== null) {
    const user = await requireUser(`/order-complete?no=${no}`);
    if (user.id !== order.userId) notFound();
  } else if (!tokenOk(order.guestToken, t)) {
    notFound();
  }
  const detailHref = order.userId !== null ? `/order-detail?no=${order.orderNumber}` : `/guest-order?no=${order.orderNumber}&t=${t}`;

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
        {order.userId !== null ? "주문 내역은 마이페이지에서 확인하실 수 있어요." : "비회원 주문이에요. 주문번호와 주문 시 입력한 휴대전화 번호로 조회할 수 있어요."}
      </p>
      <div style={{ marginTop: 40, textAlign: "left", borderTop: "1px solid #111" }}>
        <div style={rowStyle}><span style={{ color: "#767676" }}>주문 상품</span><span>{first ? `${first.name}${rest > 0 ? ` 외 ${rest}건` : ""}` : "-"}</span></div>
        <div style={rowStyle}><span style={{ color: "#767676" }}>결제 수단</span><span>{order.paymentMethod}</span></div>
        <div style={rowStyle}><span style={{ color: "#767676" }}>배송지</span><span style={{ textAlign: "right" }}>{fullAddress(order)}</span></div>
        <div style={rowStyle}><span style={{ color: "#767676" }}>결제 금액</span><b style={{ fontFamily: "Archivo,sans-serif" }}>{won(order.total)}</b></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 36 }}>
        <Link className="btn" href={detailHref} style={{ border: "1px solid #111" }}>ORDER DETAIL</Link>
        <Link className="btn" href="/" style={{ background: "#111", color: "#fff" }}>CONTINUE SHOPPING</Link>
      </div>
    </section>
  );
}
