import CheckoutForm from "@/components/CheckoutForm";
import { requireUser } from "@/lib/auth";
import { CHECKOUT_ITEMS, DISCOUNT, SHIPPING_FEE, itemOption, won } from "@/lib/orders";

export const metadata = { title: "주문/결제" };

export default async function Page() {
  const user = await requireUser("/checkout");
  const itemsTotal = CHECKOUT_ITEMS.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <section style={{ padding: "56px 60px 0" }}>
      <h1 style={{ margin: 0, font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>ORDER</h1>
      <CheckoutForm
        items={CHECKOUT_ITEMS.map((i) => ({ name: i.name, option: itemOption(i), priceText: won(i.price * i.quantity), bg: i.bg }))}
        itemsTotalText={won(itemsTotal)}
        shippingText={won(SHIPPING_FEE)}
        discountText={won(DISCOUNT)}
        totalText={won(itemsTotal + SHIPPING_FEE - DISCOUNT)}
        defaults={{ name: user.name, phone: user.phone, email: user.email }}
      />
    </section>
  );
}
