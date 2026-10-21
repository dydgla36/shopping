import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { tokenOk } from "@/lib/guest";
import { STATUS_LABEL, fmtDate, fullAddress, itemOption, won } from "@/lib/orders";
import { crumb } from "@/lib/ui";

export const metadata = { title: "비회원 주문 조회" };

const line = { display: "flex", justifyContent: "space-between", gap: 20, padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: 14 } as const;
const Row = ({ a, b }: { a: string; b: React.ReactNode }) => (
  <div style={line}><span style={{ color: "#767676", flexShrink: 0 }}>{a}</span><span style={{ textAlign: "right" }}>{b}</span></div>
);
const Title = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginTop: 36, paddingBottom: 14, borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>{children}</div>
);

// 비회원 주문 조회 화면 (읽기 전용). 주문번호와 비밀 토큰이 모두 맞아야 열립니다.
export default async function Page({ searchParams }: { searchParams: Promise<{ no?: string; t?: string }> }) {
  const { no, t } = await searchParams;
  if (!no) notFound();
  const order = await prisma.order.findUnique({ where: { orderNumber: no }, include: { items: true } });
  if (!order || order.userId !== null || !tokenOk(order.guestToken, t)) notFound();

  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; 비회원 주문 조회</div>
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "20px 24px 0" }}>
        <h1 style={{ margin: 0, font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>ORDER</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginTop: 28, padding: 28, background: "#f4f2ee" }}>
          <div><div style={{ fontSize: 12, color: "#767676" }}>주문번호</div><div style={{ marginTop: 6, font: "800 18px Archivo,sans-serif" }}>{order.orderNumber}</div></div>
          <div><div style={{ fontSize: 12, color: "#767676" }}>주문일</div><div style={{ marginTop: 6, font: "800 18px Archivo,sans-serif" }}>{fmtDate(order.createdAt)}</div></div>
          <div><div style={{ fontSize: 12, color: "#767676" }}>주문 상태</div><div style={{ marginTop: 6, fontWeight: 700, fontSize: 18 }}>{STATUS_LABEL[order.status] ?? order.status}</div></div>
        </div>
        {(order.carrier || order.trackingNumber) && (
          <div style={{ marginTop: 20, padding: "16px 20px", border: "1px solid #111", fontSize: 14, lineHeight: 1.8 }}>
            <b style={{ marginRight: 12 }}>배송 조회</b>
            택배사 <b>{order.carrier ?? "-"}</b> · 운송장 번호 <b style={{ fontFamily: "Archivo,sans-serif" }}>{order.trackingNumber ?? "-"}</b>
          </div>
        )}
        {order.adminMemo && (
          <div style={{ marginTop: 12, padding: "16px 20px", background: "#f4f2ee", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>
            <b style={{ display: "block", marginBottom: 6 }}>판매자 안내</b>
            {order.adminMemo}
          </div>
        )}

        <Title>주문 상품</Title>
        {order.items.map((it) => (
          <div key={it.id} style={{ ...line, padding: "18px 0" }}>
            <div>
              <div style={{ fontSize: 15 }}>{it.name}</div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#767676" }}>{[itemOption(it), `수량 ${it.quantity}`].filter(Boolean).join(" / ")}</div>
            </div>
            <div style={{ font: "800 15px Archivo,sans-serif" }}>{won(it.price * it.quantity)}</div>
          </div>
        ))}

        <Title>배송 정보</Title>
        <Row a="수령인" b={order.recipientName} />
        <Row a="연락처" b={order.recipientPhone} />
        <Row a="주소" b={fullAddress(order)} />
        <Row a="배송 메모" b={order.deliveryMemo ?? "-"} />

        <Title>결제 정보</Title>
        <Row a="결제 수단" b={order.paymentMethod} />
        <Row a="상품금액" b={won(order.itemsTotal)} />
        <Row a="배송비" b={won(order.shippingFee)} />
        <div style={{ ...line, borderBottom: 0, fontWeight: 700 }}><span>총 결제금액</span><span style={{ font: "800 20px Archivo,sans-serif" }}>{won(order.total)}</span></div>

        <p style={{ margin: "28px 0 0", fontSize: 13, lineHeight: 1.8, color: "#767676" }}>비회원 주문의 취소·반품·교환은 고객센터로 문의해 주세요. [고객센터 전화번호 · 이메일]</p>
        <div style={{ marginTop: 32 }}><Link href="/" style={{ display: "inline-block", padding: "14px 24px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>HOME</Link></div>
      </section>
    </>
  );
}
