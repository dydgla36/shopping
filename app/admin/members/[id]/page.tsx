import Link from "next/link";
import { notFound } from "next/navigation";
import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { grantPoints, issueCouponToMember } from "@/app/actions/members";
import { couponText } from "@/lib/coupons";
import { gradeFor, nextGrade } from "@/lib/grades";
import { STATUS_LABEL, fmtDate, won } from "@/lib/orders";
import { bodyRow, h2, headRow, notice } from "../../styles";

const title = { margin: "40px 0 0", font: "800 16px Archivo,'Noto Sans KR',sans-serif" } as const;

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id: raw } = await params;
  await requireAdmin(`/admin/members/${raw}`);
  const id = Number(raw);
  if (!Number.isInteger(id)) notFound();
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, loginId: true, name: true, email: true, phone: true, createdAt: true, marketingOptIn: true, kakaoId: true, deletedAt: true, role: true } });
  if (!user || user.deletedAt || user.role !== "USER") notFound();

  const now = new Date();
  const [pointSum, logs, owned, orders, spentAgg, available] = await Promise.all([
    prisma.pointLog.aggregate({ where: { userId: id }, _sum: { amount: true } }),
    prisma.pointLog.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.userCoupon.findMany({ where: { userId: id }, include: { coupon: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.order.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 30, include: { items: { select: { name: true } } } }),
    prisma.order.aggregate({ where: { userId: id, status: "DELIVERED" }, _sum: { total: true, shippingFee: true } }),
    prisma.coupon.findMany({ where: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }, orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  const spent = (spentAgg._sum.total ?? 0) - (spentAgg._sum.shippingFee ?? 0);
  const grade = gradeFor(spent);
  const upcoming = nextGrade(spent);
  const sp = await searchParams;
  const balance = pointSum._sum.amount ?? 0;

  return (
    <>
      <Link href="/admin/members" style={{ fontSize: 13, color: "#767676" }}>← 회원 목록</Link>
      <h2 style={{ ...h2, marginTop: 12 }}>{user.name} <span style={{ fontSize: 14, fontWeight: 400, color: "#767676" }}>({user.loginId})</span></h2>
      {sp.saved && <div style={notice(true)} role="status">저장했어요.</div>}
      <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.9, color: "#444" }}>
        {user.email} · {user.phone || "연락처 없음"} · 가입 {fmtDate(user.createdAt)} · {user.kakaoId ? "카카오 가입" : "일반 가입"} · 마케팅 수신 {user.marketingOptIn ? "동의" : "미동의"}<br />
        등급 <b>{grade.name}</b> (누적 구매 {won(spent)}{upcoming ? `, ${upcoming.name}까지 ${won(upcoming.min - spent)}` : ""}) · 적립금 <b>{balance.toLocaleString("ko-KR")}원</b>
      </p>

      <h3 style={title}>적립금 지급 · 차감</h3>
      <div style={{ maxWidth: 420 }}>
        <ActionForm action={grantPoints} submitLabel="적용" resetOnSuccess>
          <input type="hidden" name="userId" value={user.id} />
          <label className="fld">금액 (지급은 숫자, 차감은 앞에 −)<input name="amount" type="number" step={1} placeholder="예: 3000 또는 -1000" required /></label>
          <label className="fld">사유 (회원 적립금 내역에도 보여요)<input name="reason" type="text" maxLength={50} placeholder="예: 이벤트 당첨, 오배송 사과" required /></label>
        </ActionForm>
      </div>
      <div style={{ borderTop: "1px solid #111", marginTop: 16 }}>
        {logs.length === 0 && <div style={{ padding: "16px 4px", fontSize: 13, color: "#767676" }}>적립금 내역이 없어요.</div>}
        {logs.map((l) => (
          <div key={l.id} style={bodyRow("110px 1fr 100px")}>
            <span style={{ color: "#767676" }}>{fmtDate(l.createdAt)}</span><span>{l.reason}</span>
            <span style={{ fontFamily: "Archivo,sans-serif", fontWeight: 700, color: l.amount > 0 ? "#2d6a2d" : "#c0392b" }}>{l.amount > 0 ? "+" : "−"} {Math.abs(l.amount).toLocaleString("ko-KR")}</span>
          </div>
        ))}
      </div>

      <h3 style={title}>쿠폰 지급</h3>
      <div style={{ maxWidth: 420 }}>
        <ActionForm action={issueCouponToMember} submitLabel="쿠폰 지급">
          <input type="hidden" name="userId" value={user.id} />
          <label className="fld">쿠폰
            <select name="couponId" defaultValue={available[0]?.id ?? ""} required>
              {available.length === 0 && <option value="">지급할 수 있는 쿠폰이 없어요</option>}
              {available.map((c) => <option key={c.id} value={c.id}>{c.name} ({couponText(c)})</option>)}
            </select>
          </label>
        </ActionForm>
      </div>
      <div style={{ borderTop: "1px solid #111", marginTop: 16 }}>
        {owned.length === 0 && <div style={{ padding: "16px 4px", fontSize: 13, color: "#767676" }}>가진 쿠폰이 없어요.</div>}
        {owned.map((u) => (
          <div key={u.id} style={bodyRow("110px 1fr 120px")}>
            <span style={{ color: "#767676" }}>{fmtDate(u.createdAt)}</span><span>{u.coupon.name} ({couponText(u.coupon)})</span>
            <span style={{ fontWeight: 700, color: u.usedAt ? "#767676" : u.coupon.expiresAt && u.coupon.expiresAt < now ? "#c0392b" : "#2d6a2d" }}>{u.usedAt ? "사용 완료" : u.coupon.expiresAt && u.coupon.expiresAt < now ? "만료" : "사용 가능"}</span>
          </div>
        ))}
      </div>

      <h3 style={title}>주문 내역 ({orders.length}건{orders.length === 30 ? " 이상, 최근 30건만" : ""})</h3>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 560, borderTop: "1px solid #111", marginTop: 12 }}>
          <div style={headRow("150px 1fr 110px 90px")}><span>주문번호</span><span>상품</span><span>금액</span><span>상태</span></div>
          {orders.length === 0 && <div style={{ padding: "16px 12px", fontSize: 13, color: "#767676" }}>주문이 없어요.</div>}
          {orders.map((o) => (
            <div key={o.id} style={bodyRow("150px 1fr 110px 90px")}>
              <Link href={`/admin/orders/${o.orderNumber}`} style={{ borderBottom: "1px solid #ccc", width: "fit-content", fontSize: 12 }}>{o.orderNumber}</Link>
              <span style={{ fontSize: 13 }}>{o.items[0]?.name ?? "-"}{o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : ""}</span>
              <span style={{ fontFamily: "Archivo,sans-serif" }}>{won(o.total)}</span>
              <span style={{ fontWeight: 700 }}>{STATUS_LABEL[o.status] ?? o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
