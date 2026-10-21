import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL, fmtDate, won } from "@/lib/orders";

export const metadata = { title: "마이페이지" };

const menu = [
  ["주문 내역", "/mypage"],
  ["취소 / 반품 / 교환", "/claims"],
  ["관심 상품", "/wishlist"],
  ["적립금", "/points"],
  ["쿠폰", "/coupons"],
  ["회원 정보 수정", "/profile-edit"],
];
const head = { font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" } as const;
const cols = "120px 1fr 120px 96px";

export default async function Page() {
  const user = await requireUser("/mypage");
  const [orders, grouped] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.order.groupBy({ by: ["status"], where: { userId: user.id }, _count: { _all: true } }),
  ]);
  const [pointSum, couponCount] = await Promise.all([
    prisma.pointLog.aggregate({ where: { userId: user.id }, _sum: { amount: true } }).catch(() => null),
    prisma.userCoupon.count({ where: { userId: user.id, usedAt: null, coupon: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } } }).catch(() => 0),
  ]);
  const count = (...statuses: string[]) => grouped.filter((g) => statuses.includes(g.status)).reduce((n, g) => n + g._count._all, 0);
  const stats = [
    ["주문 접수", count("PENDING")],
    ["배송 준비", count("PAID", "PREPARING")],
    ["배송 중", count("SHIPPING")],
    ["배송 완료", count("DELIVERED")],
  ] as const;

  return (
    <section style={{ padding: "56px 60px 0" }}>
      <h1 style={{ margin: 0, font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>MY PAGE</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, marginTop: 32, alignItems: "start" }}>
        <nav style={{ borderTop: "1px solid #111", maxWidth: 240 }}>
          {menu.map(([label, href], i) => (
            <Link key={href} href={href} style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: `${i === 0 ? 700 : 400} 14px 'Noto Sans KR',sans-serif`, color: i === 0 ? undefined : "#555" }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ gridColumn: "span 2", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24, padding: 28, background: "#f4f2ee" }}>
            <div>
              <div style={{ font: "700 18px 'Noto Sans KR',sans-serif" }}>{user.name}님, 안녕하세요</div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#767676" }}>회원 등급 [등급]</div>
            </div>
            <div style={{ display: "flex", gap: 40 }}>
              <div><div style={{ fontSize: 12, color: "#767676" }}>적립금</div><div style={{ marginTop: 4, font: "800 20px Archivo,sans-serif" }}>{(pointSum?._sum.amount ?? 0).toLocaleString("ko-KR")}원</div></div>
              <div><div style={{ fontSize: 12, color: "#767676" }}>쿠폰</div><div style={{ marginTop: 4, font: "800 20px Archivo,sans-serif" }}>{couponCount}장</div></div>
            </div>
          </div>

          <div style={{ marginTop: 40, ...head }}>주문 처리 현황</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginTop: 14, borderTop: "1px solid #111", borderBottom: "1px solid #e5e5e5" }}>
            {stats.map(([label, n]) => (
              <div key={label} style={{ padding: "20px 8px", textAlign: "center" }}>
                <div style={{ font: "800 24px Archivo,sans-serif" }}>{n}</div>
                <div style={{ marginTop: 6, fontSize: 12, color: "#767676" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, ...head }}>최근 주문 내역</div>
          <div style={{ overflowX: "auto", marginTop: 14 }}>
            <div style={{ minWidth: 560, borderTop: "1px solid #111" }}>
              <div style={{ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "14px 12px", borderBottom: "1px solid #e5e5e5", font: "700 12px 'Noto Sans KR',sans-serif", color: "#767676" }}>
                <span>주문일</span><span>상품</span><span>금액</span><span>상태</span>
              </div>
              {orders.length === 0 && (
                <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676", borderBottom: "1px solid #e5e5e5" }}>아직 주문 내역이 없어요.</div>
              )}
              {orders.map((o) => (
                <div key={o.id} style={{ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: 14, alignItems: "center" }}>
                  <span style={{ color: "#767676" }}>{fmtDate(o.createdAt)}</span>
                  <div>
                    <Link href={`/order-detail?no=${o.orderNumber}`}>
                      {o.items[0]?.name ?? "-"}
                      {o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : ""}
                    </Link>
                    {(o.carrier || o.trackingNumber) && (
                      <div style={{ marginTop: 4, fontSize: 12, color: "#555" }}>택배 {o.carrier ?? ""} {o.trackingNumber ?? ""}</div>
                    )}
                    {o.adminMemo && <div style={{ marginTop: 4, fontSize: 12, color: "#2d6a2d" }}>판매자 안내가 있어요</div>}
                  </div>
                  <span style={{ fontFamily: "Archivo,sans-serif" }}>{won(o.total)}</span>
                  <span style={{ fontWeight: 700 }}>{STATUS_LABEL[o.status] ?? o.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
