import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { registerCoupon } from "@/app/actions/coupons";
import { couponText } from "@/lib/coupons";
import { fmtDate, won } from "@/lib/orders";
import { chip, crumb, h1, pageWrap, subtitle } from "@/lib/ui";

export const metadata = { title: "쿠폰" };

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireUser("/coupons");
  const tab = (await searchParams).tab === "used" ? "used" : "available";
  const all = await prisma.userCoupon.findMany({ where: { userId: user.id }, include: { coupon: true }, orderBy: { createdAt: "desc" } });
  const now = new Date();
  const isAvailable = (u: (typeof all)[number]) => !u.usedAt && u.coupon.active && (!u.coupon.expiresAt || u.coupon.expiresAt > now);
  const list = all.filter((u) => (tab === "available" ? isAvailable(u) : !isAvailable(u)));

  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/mypage" style={{ color: "#767676" }}>MY PAGE</Link> &gt; 쿠폰</div>
      <section style={pageWrap}>
        <h1 style={{ ...h1, fontSize: 30 }}>COUPON</h1>
        <p style={subtitle}>사용 가능한 쿠폰 {all.filter(isAvailable).length}장</p>
        <div style={{ maxWidth: 520, marginTop: 8 }}>
          <ActionForm action={registerCoupon} submitLabel="REGISTER" resetOnSuccess>
            <label className="fld">쿠폰 번호 등록<input name="code" type="text" placeholder="쿠폰 번호를 입력하세요" autoCapitalize="characters" required /></label>
          </ActionForm>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
          <Link href="/coupons" style={chip(tab === "available")}>사용 가능</Link>
          <Link href="/coupons?tab=used" style={chip(tab === "used")}>사용 완료 · 만료</Link>
        </div>
        {list.length === 0 && <div style={{ padding: "40px 0", fontSize: 14, color: "#767676" }}>{tab === "available" ? "사용 가능한 쿠폰이 없어요." : "사용했거나 만료된 쿠폰이 없어요."}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16, marginTop: 24 }}>
          {list.map((u) => {
            const ok = isAvailable(u);
            return (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "110px 1fr", border: "1px solid #ddd", opacity: ok ? 1 : 0.55 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#fff", font: "800 20px Archivo,'Noto Sans KR',sans-serif", padding: "20px 8px", textAlign: "center" }}>{couponText(u.coupon)}</div>
                <div style={{ padding: 20 }}>
                  <div style={{ font: "500 15px 'Noto Sans KR',sans-serif" }}>{u.coupon.name}</div>
                  <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.7, color: "#767676" }}>
                    {u.coupon.minOrder > 0 ? `${won(u.coupon.minOrder)} 이상 구매 시` : "최소 주문 금액 없음"}<br />
                    {u.coupon.expiresAt ? `${fmtDate(u.coupon.expiresAt)}까지` : "기간 제한 없음"}
                    {u.usedAt && <><br />사용 완료</>}
                    {!u.usedAt && !ok && <><br />만료 또는 사용 중지</>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
