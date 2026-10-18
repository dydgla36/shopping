import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL, fmtDate, itemOption, won } from "@/lib/orders";

export const metadata = { title: "주문 상세" };

const head = { font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" } as const;
const line = { display: "flex", justifyContent: "space-between", gap: 20, padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: 14 } as const;
const Row = ({ a, b }: { a: string; b: React.ReactNode }) => (
  <div style={line}><span style={{ color: "#767676", flexShrink: 0 }}>{a}</span><span style={{ textAlign: "right" }}>{b}</span></div>
);

export default async function Page({ searchParams }: { searchParams: Promise<{ no?: string }> }) {
  const { no } = await searchParams;
  const user = await requireUser(`/order-detail${no ? `?no=${no}` : ""}`);
  if (!no) notFound();

  // 로그인한 본인의 주문만 조회합니다.
  const order = await prisma.order.findFirst({ where: { orderNumber: no, userId: user.id }, include: { items: true } });
  if (!order) notFound();

  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: 12, color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/mypage" style={{ color: "#767676" }}>MY PAGE</Link> &gt; ORDER DETAIL
      </div>
      <section style={{ padding: "20px 60px 0" }}>
        <h1 style={{ margin: 0, font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>ORDER DETAIL</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, marginTop: 28, padding: 28, background: "#f4f2ee" }}>
          <div><div style={{ fontSize: 12, color: "#767676" }}>주문번호</div><div style={{ marginTop: 6, font: "800 18px Archivo,sans-serif" }}>{order.orderNumber}</div></div>
          <div><div style={{ fontSize: 12, color: "#767676" }}>주문일</div><div style={{ marginTop: 6, font: "800 18px Archivo,sans-serif" }}>{fmtDate(order.createdAt)}</div></div>
          <div><div style={{ fontSize: 12, color: "#767676" }}>주문 상태</div><div style={{ marginTop: 6, fontWeight: 700, fontSize: 18 }}>{STATUS_LABEL[order.status] ?? order.status}</div></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 56, marginTop: 8, alignItems: "start" }}>
          <div>
            <div style={{ marginTop: 40, paddingBottom: 14, borderBottom: "1px solid #111", ...head }}>주문 상품</div>
            {order.items.map((it) => (
              <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "18px 0", borderBottom: "1px solid #e5e5e5" }}>
                <div>
                  <div style={{ fontSize: 15 }}>{it.name}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: "#767676" }}>{[itemOption(it), `수량 ${it.quantity}`].filter(Boolean).join(" / ")}</div>
                </div>
                <div style={{ font: "800 15px Archivo,sans-serif" }}>{won(it.price * it.quantity)}</div>
              </div>
            ))}
            <div style={{ marginTop: 40, paddingBottom: 14, borderBottom: "1px solid #111", ...head }}>배송 정보</div>
            <Row a="수령인" b={order.recipientName} />
            <Row a="연락처" b={order.recipientPhone} />
            <Row a="주소" b={`${order.address}${order.addressDetail ? ` ${order.addressDetail}` : ""}`} />
            <Row a="배송 메모" b={order.deliveryMemo ?? "-"} />
          </div>
          <div>
            <div style={{ marginTop: 40, paddingBottom: 14, borderBottom: "1px solid #111", ...head }}>결제 정보</div>
            <Row a="결제 수단" b={order.paymentMethod} />
            <Row a="상품금액" b={won(order.itemsTotal)} />
            <Row a="배송비" b={won(order.shippingFee)} />
            <Row a="할인 금액" b={won(order.discount)} />
            <div style={{ ...line, borderBottom: 0, fontWeight: 700 }}><span>총 결제금액</span><span style={{ font: "800 20px Archivo,sans-serif" }}>{won(order.total)}</span></div>
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          <Link href="/mypage" style={{ display: "inline-block", padding: "14px 24px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>BACK TO MY PAGE</Link>
        </div>
      </section>
    </>
  );
}
