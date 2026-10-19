import { notFound } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import { requireUser } from "@/lib/auth";
import { resolveLines } from "@/lib/checkout";
import { DISCOUNT, SHIPPING_FEE, itemOption, won } from "@/lib/orders";

export const metadata = { title: "주문/결제" };

export default async function Page({ searchParams }: { searchParams: Promise<{ product?: string; size?: string; qty?: string }> }) {
  const sp = await searchParams;
  // 로그인 후 같은 상품으로 돌아오도록, 주소의 상품 정보(?product=...)를 함께 넘깁니다.
  const qs = new URLSearchParams(Object.entries(sp).filter((e): e is [string, string] => typeof e[1] === "string")).toString();
  const user = await requireUser(`/checkout${qs ? `?${qs}` : ""}`);

  const lines = await resolveLines(sp);
  if (!lines) notFound();
  const itemsTotal = lines.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <section style={{ padding: "56px 60px 0" }}>
      <h1 style={{ margin: 0, font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>ORDER</h1>
      <CheckoutForm
        items={lines.map((i) => ({ name: i.name, option: itemOption(i), quantity: i.quantity, priceText: won(i.price * i.quantity), bg: i.bg }))}
        itemsTotalText={won(itemsTotal)}
        shippingText={won(SHIPPING_FEE)}
        discountText={won(DISCOUNT)}
        totalText={won(itemsTotal + SHIPPING_FEE - DISCOUNT)}
        defaults={{ name: user.name, phone: user.phone, email: user.email }}
        hidden={{ productId: sp.product ?? "", size: sp.size ?? "", qty: sp.qty ?? "" }}
      />
    </section>
  );
}
