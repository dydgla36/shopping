import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import ActionForm from "@/components/ActionForm";
import { createClaim } from "@/app/actions/claims";
import { cancelMyOrder } from "@/app/actions/cancel";
import { CLAIM_STATUS, CLAIM_TYPE, STATUS_LABEL, fmtDate, fullAddress, itemOption, won } from "@/lib/orders";

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
  const claims = await prisma.claim.findMany({ where: { orderId: order.id }, orderBy: { createdAt: "desc" } }).catch(() => []);
  const openClaim = claims.some((c) => c.status === "RECEIVED" || c.status === "PROCESSING");
  const cancelable = ["PENDING", "PAID"].includes(order.status); // 배송 준비 전: 사유를 적고 바로 취소
  const claimTypes = order.status === "PREPARING" ? ["CANCEL"] : ["SHIPPING", "DELIVERED"].includes(order.status) ? ["RETURN", "EXCHANGE"] : [];

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

        {order.status === "CANCELED" && (
          <div role="status" style={{ marginTop: 20, padding: "16px 20px", background: "#fbeeee", fontSize: 14, lineHeight: 1.8 }}>
            <b>취소된 주문이에요.</b>{order.canceledAt && <span style={{ color: "#767676" }}> ({fmtDate(order.canceledAt)})</span>}
            {order.cancelReason && <div style={{ marginTop: 4, whiteSpace: "pre-line" }}>취소 사유: {order.cancelReason}</div>}
          </div>
        )}
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 56, marginTop: 8, alignItems: "start" }}>
          <div>
            <div style={{ marginTop: 40, paddingBottom: 14, borderBottom: "1px solid #111", ...head }}>주문 상품</div>
            {order.items.map((it) => (
              <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "18px 0", borderBottom: "1px solid #e5e5e5" }}>
                <div>
                  <div style={{ fontSize: 15 }}>{it.name}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: "#767676" }}>{[itemOption(it), `수량 ${it.quantity}`].filter(Boolean).join(" / ")}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ font: "800 15px Archivo,sans-serif" }}>{won(it.price * it.quantity)}</div>
                  {order.status === "DELIVERED" && it.productId && <Link href={`/review/write?product=${it.productId}`} style={{ display: "inline-block", marginTop: 8, fontSize: 12, borderBottom: "1px solid #111" }}>후기 쓰기</Link>}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 40, paddingBottom: 14, borderBottom: "1px solid #111", ...head }}>배송 정보</div>
            <Row a="수령인" b={order.recipientName} />
            <Row a="연락처" b={order.recipientPhone} />
            <Row a="주소" b={fullAddress(order)} />
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
        {cancelable && (
          <div style={{ maxWidth: 520, marginTop: 8 }}>
            <div style={{ marginTop: 40, paddingBottom: 14, borderBottom: "1px solid #111", ...head }}>주문 취소</div>
            <p style={{ margin: "12px 0 0", fontSize: 13, lineHeight: 1.7, color: "#555" }}>배송 준비 전에는 바로 취소할 수 있어요. 취소 사유는 판매자에게 전달되고, 사용한 쿠폰·적립금은 돌려드려요.</p>
            <ActionForm action={cancelMyOrder} submitLabel="주문 취소하기" confirmMessage="이 주문을 취소할까요? 취소하면 되돌릴 수 없어요.">
              <input type="hidden" name="orderNumber" value={order.orderNumber} />
              <label className="fld">취소 사유<textarea name="reason" rows={4} maxLength={500} placeholder="취소 사유를 5자 이상 입력해 주세요" required /></label>
            </ActionForm>
          </div>
        )}
        <div style={{ maxWidth: 520, marginTop: 8 }}>
          <div style={{ marginTop: 40, paddingBottom: 14, borderBottom: "1px solid #111", ...head }}>{order.status === "PREPARING" ? "취소 요청" : "반품 / 교환"}</div>
          {claims.map((c) => (
            <div key={c.id} style={{ padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: 14 }}>
              <b>{CLAIM_TYPE[c.type] ?? c.type}</b> · {CLAIM_STATUS[c.status] ?? c.status} · <span style={{ color: "#767676" }}>{fmtDate(c.createdAt)}</span>
              <div style={{ marginTop: 6, fontSize: 13, color: "#555", whiteSpace: "pre-line" }}>{c.reason}</div>
              {c.adminNote && <div style={{ marginTop: 6, fontSize: 13, color: "#2d6a2d" }}>처리 안내: {c.adminNote}</div>}
            </div>
          ))}
          {claimTypes.length > 0 && !openClaim ? (
            <ActionForm action={createClaim} submitLabel="신청하기">
              <input type="hidden" name="orderNumber" value={order.orderNumber} />
              <label className="fld">신청 유형
                <select name="type">{claimTypes.map((t) => <option key={t} value={t}>{CLAIM_TYPE[t]}</option>)}</select>
              </label>
              <label className="fld">사유<textarea name="reason" rows={4} maxLength={500} placeholder="사유를 5자 이상 입력해 주세요" required /></label>
            </ActionForm>
          ) : (
            <p style={{ margin: "16px 0 0", fontSize: 13, color: "#767676" }}>
              {openClaim ? "처리 중인 신청이 있어요. 처리가 끝나면 다시 신청할 수 있어요." : order.status === "CANCELED" ? "취소된 주문이에요." : ["PENDING", "PAID"].includes(order.status) ? "배송 준비 전에는 위의 '주문 취소'로 바로 취소할 수 있어요." : "지금은 신청할 수 없는 주문이에요."}
            </p>
          )}
        </div>
        <div style={{ marginTop: 40 }}>
          <Link href="/mypage" style={{ display: "inline-block", padding: "14px 24px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>BACK TO MY PAGE</Link>
        </div>
      </section>
    </>
  );
}
