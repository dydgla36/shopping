import { notFound, redirect } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { resolveLines } from "@/lib/checkout";
import { SHIPPING_FEE, itemOption, won } from "@/lib/orders";

export const metadata = { title: "주문/결제" };

export default async function Page({ searchParams }: { searchParams: Promise<{ product?: string; size?: string; qty?: string; cart?: string }> }) {
  const sp = await searchParams;
  // 로그인 후 같은 상품으로 돌아오도록, 주소의 상품 정보(?product=...)를 함께 넘깁니다.
  const qs = new URLSearchParams(Object.entries(sp).filter((e): e is [string, string] => typeof e[1] === "string")).toString();
  const here = `/checkout${qs ? `?${qs}` : ""}`;
  const user = await getCurrentUser();

  // 비회원은 상품 상세의 BUY NOW 주문만 할 수 있습니다. (장바구니 주문은 로그인 필요)
  if (!user && (sp.cart === "1" || !sp.product)) redirect(`/login?next=${encodeURIComponent(here)}`);

  const lines = await resolveLines({ ...sp, cart: sp.cart === "1", userId: user?.id });
  if (!lines) {
    if (sp.cart === "1") redirect("/cart"); // 장바구니가 비어 있으면 장바구니로
    notFound();
  }
  const itemsTotal = lines.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // 적립금 잔액과 쓸 수 있는 쿠폰 (회원만. 관련 테이블이 아직 없어도 결제 화면은 보이게 합니다)
  const [balance, owned] = user
    ? await Promise.all([
        prisma.pointLog.aggregate({ where: { userId: user.id }, _sum: { amount: true } }).then((r) => r._sum.amount ?? 0).catch(() => 0),
        prisma.userCoupon.findMany({
          where: { userId: user.id, usedAt: null, coupon: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } },
          include: { coupon: true },
        }).catch(() => []),
      ])
    : [0, []];

  return (
    <section style={{ padding: "56px 60px 0" }}>
      <h1 style={{ margin: 0, font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>ORDER</h1>
      <CheckoutForm
        items={lines.map((i) => ({ name: i.name, option: itemOption(i), quantity: i.quantity, priceText: won(i.price * i.quantity), bg: i.bg }))}
        itemsTotal={itemsTotal}
        shipping={SHIPPING_FEE}
        balance={Math.max(0, balance)}
        coupons={owned.map((u) => ({ id: u.id, name: u.coupon.name, kind: u.coupon.kind, value: u.coupon.value, minOrder: u.coupon.minOrder }))}
        defaults={{ name: user?.name ?? "", phone: user?.phone ?? "", email: user?.email ?? "" }}
        hidden={{ productId: sp.product ?? "", size: sp.size ?? "", qty: sp.qty ?? "", cart: sp.cart === "1" ? "1" : "" }}
        guest={!user}
        loginHref={`/login?next=${encodeURIComponent(here)}`}
      />
    </section>
  );
}
