import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { CLAIM_STATUS, CLAIM_TYPE, fmtDate } from "@/lib/orders";
import { bodyRow, crumb, h1, headRow, pageWrap, subtitle } from "@/lib/ui";

export const metadata = { title: "취소 / 반품 / 교환" };
const cols = "100px 160px 70px 1fr 90px";

export default async function Page() {
  const user = await requireUser("/claims");
  const claims = await prisma.claim.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50, include: { order: { select: { orderNumber: true } } } });
  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/mypage" style={{ color: "#767676" }}>MY PAGE</Link> &gt; 취소 / 반품 / 교환</div>
      <section style={pageWrap}>
        <h1 style={{ ...h1, fontSize: 30 }}>CLAIMS</h1>
        <p style={subtitle}>취소·반품·교환 신청 내역이에요. 신청은 <Link href="/mypage" style={{ borderBottom: "1px solid #555" }}>주문 내역</Link>에서 주문을 열어 할 수 있어요.</p>
        <div style={{ overflowX: "auto", marginTop: 28 }}>
          <div style={{ minWidth: 640, borderTop: "1px solid #111" }}>
            <div style={headRow(cols)}><span>신청일</span><span>주문번호</span><span>유형</span><span>사유 / 처리 안내</span><span>상태</span></div>
            {claims.length === 0 && <div style={{ padding: "40px 12px", fontSize: 14, color: "#767676" }}>신청 내역이 없어요.</div>}
            {claims.map((c) => (
              <div key={c.id} style={bodyRow(cols)}>
                <span style={{ color: "#767676" }}>{fmtDate(c.createdAt)}</span>
                <Link href={`/order-detail?no=${c.order.orderNumber}`} style={{ borderBottom: "1px solid #ccc", width: "fit-content", fontSize: 13 }}>{c.order.orderNumber}</Link>
                <span>{CLAIM_TYPE[c.type] ?? c.type}</span>
                <span style={{ fontSize: 13, whiteSpace: "pre-line" }}>{c.reason}{c.adminNote && <><br /><span style={{ color: "#2d6a2d" }}>처리 안내: {c.adminNote}</span></>}</span>
                <span style={{ fontWeight: 700 }}>{CLAIM_STATUS[c.status] ?? c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
