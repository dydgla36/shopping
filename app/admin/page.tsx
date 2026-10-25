import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { STATUS_LABEL, fmtDate, won } from "@/lib/orders";
import { bodyRow, card, cardLabel, cardValue, h2, headRow } from "./styles";

export default async function Page() {
  await requireAdmin();
  // 한국 시간 기준 오늘 0시
  const kst = new Date(Date.now() + 9 * 3600 * 1000);
  kst.setUTCHours(0, 0, 0, 0);
  const todayStart = new Date(kst.getTime() - 9 * 3600 * 1000);

  let loaded;
  try {
    loaded = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELED" } } }),
    prisma.order.count({ where: { status: { in: ["PENDING", "PAID", "PREPARING"] } } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    // 품절이거나 재고가 3개 이하인 사이즈 수 (재고 테이블이 아직 없으면 0)
    prisma.productStock.count({ where: { quantity: { lte: 3 } } }).catch(() => 0),
    prisma.question.count({ where: { answer: null } }).catch(() => 0),
    prisma.claim.count({ where: { status: { in: ["RECEIVED", "PROCESSING"] } } }).catch(() => 0),
    prisma.order.count({ where: { status: "CANCELED", canceledAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) } } }),
  ]);
  } catch (e) {
    // 새 기능에 필요한 컬럼·테이블이 아직 DB에 없을 때: 대시보드가 멈추지 않고 DB 설정 안내를 보여줍니다.
    console.error("대시보드 조회 실패:", e);
    return (
      <>
        <h2 style={h2}>대시보드</h2>
        <div role="alert" style={{ marginTop: 20, padding: "16px 20px", background: "#fbeeee", color: "#c0392b", fontSize: 14, lineHeight: 1.8 }}>
          DB에 새 기능에 필요한 테이블이나 컬럼이 아직 없는 것 같아요.{" "}
          <Link href="/admin/setup" style={{ borderBottom: "1px solid #c0392b" }}>관리자 &gt; DB 설정</Link>에서 <b>테이블 만들기</b>를 한 번 눌러 주세요.
        </div>
      </>
    );
  }
  const [today, total, sum, waiting, members, recent, lowStock, openQna, openClaims, canceledRecent] = loaded;
  const cols = "100px 150px 1fr 110px 90px";

  return (
    <>
      <h2 style={h2}>대시보드</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 20 }}>
        <div style={card}><div style={cardLabel}>오늘 주문</div><div style={cardValue}>{today}</div></div>
        <div style={card}><div style={cardLabel}>배송 처리 대기</div><div style={cardValue}>{waiting}</div></div>
        <div style={card}><div style={cardLabel}>전체 주문</div><div style={cardValue}>{total}</div></div>
        <div style={card}><div style={cardLabel}>회원 수</div><div style={cardValue}>{members}</div></div>
        <Link href="/admin/qna?status=waiting" style={{ ...card, display: "block" }}><div style={cardLabel}>답변 대기 문의</div><div style={{ ...cardValue, color: openQna > 0 ? "#c0392b" : undefined }}>{openQna}</div></Link>
        <Link href="/admin/orders?status=CANCELED" style={{ ...card, display: "block" }}><div style={cardLabel}>최근 7일 취소 주문</div><div style={{ ...cardValue, color: canceledRecent > 0 ? "#c0392b" : undefined }}>{canceledRecent}</div></Link>
        <Link href="/admin/claims" style={{ ...card, display: "block" }}><div style={cardLabel}>처리 대기 취소·반품·교환</div><div style={{ ...cardValue, color: openClaims > 0 ? "#c0392b" : undefined }}>{openClaims}</div></Link>
        <Link href="/admin/products" style={{ ...card, display: "block" }}><div style={cardLabel}>품절·재고 부족 (3개 이하)</div><div style={{ ...cardValue, color: lowStock > 0 ? "#c0392b" : undefined }}>{lowStock}</div></Link>
        <div style={{ ...card, flexBasis: 260 }}><div style={cardLabel}>주문 금액 합계 (취소 제외)</div><div style={cardValue}>{won(sum._sum.total ?? 0)}</div></div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 44 }}>
        <h2 style={{ ...h2, fontSize: 18 }}>최근 주문</h2>
        <Link href="/admin/orders" style={{ fontSize: 13, borderBottom: "1px solid #111" }}>전체 보기</Link>
      </div>
      <div style={{ overflowX: "auto", marginTop: 14 }}>
        <div style={{ minWidth: 600, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>주문일</span><span>주문번호</span><span>받는 사람</span><span>금액</span><span>상태</span></div>
          {recent.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>아직 주문이 없어요.</div>}
          {recent.map((o) => (
            <div key={o.id} style={bodyRow(cols)}>
              <span style={{ color: "#767676" }}>{fmtDate(o.createdAt)}</span>
              <Link href={`/admin/orders/${o.orderNumber}`} style={{ borderBottom: "1px solid #ccc", width: "fit-content" }}>{o.orderNumber}</Link>
              <span>{o.recipientName}</span>
              <span style={{ fontFamily: "Archivo,sans-serif" }}>{won(o.total)}</span>
              <span style={{ fontWeight: 700 }}>{STATUS_LABEL[o.status] ?? o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
