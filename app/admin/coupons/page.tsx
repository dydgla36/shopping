import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { createCoupon, deleteCoupon, toggleCoupon } from "@/app/actions/adminContent";
import { couponText } from "@/lib/coupons";
import { fmtDate, won } from "@/lib/orders";
import { bodyRow, btnLine, h2, headRow } from "../styles";

const cols = "130px 1fr 80px 120px 90px 150px";

export default async function Page() {
  await requireAdmin("/admin/coupons");
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { _count: { select: { users: true } } } });
  const now = new Date();
  return (
    <>
      <h2 style={h2}>쿠폰 관리</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: "#767676" }}>쿠폰을 만들고, 고객에게 쿠폰 번호를 알려주면 고객이 쿠폰 화면에서 번호를 등록해 사용해요. 쿠폰은 주문당 1개, 사용한 쿠폰은 주문을 취소하면 돌아가요.</p>
      <div style={{ maxWidth: 560, marginTop: 20, padding: 20, background: "#f4f2ee" }}>
        <div style={{ font: "700 13px 'Noto Sans KR',sans-serif" }}>새 쿠폰 만들기</div>
        <ActionForm action={createCoupon} submitLabel="쿠폰 만들기" resetOnSuccess>
          <label className="fld">쿠폰 번호 (영문 대문자·숫자·-, 4~20자)<input name="code" type="text" placeholder="예: WELCOME10" required /></label>
          <label className="fld">쿠폰 이름<input name="name" type="text" maxLength={50} placeholder="예: 신규 가입 10% 쿠폰" required /></label>
          <label className="fld">할인 방식<select name="kind" defaultValue="PERCENT"><option value="PERCENT">정률 (%)</option><option value="AMOUNT">정액 (원)</option></select></label>
          <label className="fld">할인 값 (정률이면 1~100, 정액이면 원)<input name="value" type="number" min={1} required /></label>
          <label className="fld">최소 주문 금액 (원, 선택)<input name="minOrder" type="number" min={0} placeholder="0" /></label>
          <label className="fld">만료일 (선택, 비우면 기간 제한 없음)<input name="expiresAt" type="date" /></label>
        </ActionForm>
      </div>
      <div style={{ overflowX: "auto", marginTop: 32 }}>
        <div style={{ minWidth: 780, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>번호</span><span>이름 · 할인</span><span>등록</span><span>조건</span><span>상태</span><span /></div>
          {coupons.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>쿠폰이 없어요.</div>}
          {coupons.map((c) => {
            const expired = c.expiresAt && c.expiresAt < now;
            return (
              <div key={c.id} style={bodyRow(cols)}>
                <span style={{ fontFamily: "Archivo,sans-serif", fontSize: 13 }}>{c.code}</span>
                <span>{c.name} · <b>{couponText(c)}</b></span>
                <span>{c._count.users}명</span>
                <span style={{ fontSize: 12, color: "#767676" }}>{c.minOrder > 0 ? `${won(c.minOrder)} 이상` : "제한 없음"}<br />{c.expiresAt ? `${fmtDate(c.expiresAt)}까지` : "기간 없음"}</span>
                <span style={{ fontWeight: 700, color: c.active && !expired ? "#2d6a2d" : "#767676" }}>{expired ? "만료" : c.active ? "사용 중" : "중지"}</span>
                <span style={{ display: "flex", gap: 6 }}>
                  <form action={toggleCoupon}><input type="hidden" name="id" value={c.id} /><button type="submit" style={btnLine}>{c.active ? "중지" : "재개"}</button></form>
                  <form action={deleteCoupon}><input type="hidden" name="id" value={c.id} /><button type="submit" style={{ ...btnLine, color: "#c0392b", borderColor: "#c0392b" }}>DEL</button></form>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
