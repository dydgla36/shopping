import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { changeCartQty, removeFromCart } from "@/app/actions/cart";
import { DISCOUNT, SHIPPING_FEE, unitPrice, won } from "@/lib/orders";
import { groupStock } from "@/lib/stock";

export const metadata = { title: "장바구니" };

const qtyBtn = { padding: "8px 14px", background: "none", border: 0, cursor: "pointer", font: "500 13px Archivo,sans-serif" } as const;
const row = { display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 14 } as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const user = await requireUser("/cart");
  const items = await prisma.cartItem.findMany({ where: { userId: user.id }, include: { product: true }, orderBy: { id: "asc" } });
  const itemsTotal = items.reduce((sum, i) => sum + unitPrice(i.product) * i.quantity, 0);

  // 담은 뒤 재고가 줄었거나 품절이 된 상품을 찾습니다. (재고 테이블이 없으면 확인하지 않음)
  const stocks = groupStock(await prisma.productStock.findMany({ where: { productId: { in: items.map((i) => i.productId) } } }).catch(() => []));
  const problem = (i: (typeof items)[number]) => {
    if (i.product.soldOut) return "품절이에요. 삭제해 주세요.";
    const left = stocks.get(i.productId)?.[i.size];
    if (left === undefined || i.quantity <= left) return null;
    return left === 0 ? "품절이에요. 삭제해 주세요." : `재고가 ${left}개 남았어요. 수량을 줄여 주세요.`;
  };
  const blocked = items.some((i) => problem(i));

  return (
    <section style={{ padding: "56px 60px 0" }}>
      <h1 style={{ margin: 0, font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>CART</h1>
      {notice && <div role="status" style={{ marginTop: 24, padding: "12px 16px", fontSize: 13, background: "#f4f2ee", color: "#444" }}>{notice}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 56, marginTop: 32, alignItems: "start" }}>
        <div style={{ borderTop: "1px solid #111" }}>
          {items.length === 0 && (
            <div style={{ padding: "48px 0", fontSize: 14, color: "#767676", borderBottom: "1px solid #e5e5e5" }}>장바구니가 비어 있어요.</div>
          )}
          {items.map((i) => (
            <div key={i.id} style={{ display: "grid", gridTemplateColumns: "96px 1fr auto", gap: 20, alignItems: "center", padding: "24px 0", borderBottom: "1px solid #e5e5e5" }}>
              <Link href={`/product/${i.productId}`} style={{ display: "block", width: 96, aspectRatio: "4/5", background: i.product.bg, position: "relative", overflow: "hidden" }}>
                {i.product.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.product.imageUrl} alt={i.product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </Link>
              <div>
                <div style={{ font: "400 12px Archivo,sans-serif", color: "#767676" }}>[브랜드명]</div>
                <Link href={`/product/${i.productId}`} style={{ display: "block", marginTop: 4, font: "500 15px/1.4 'Noto Sans KR',sans-serif" }}>{i.product.name}</Link>
                <div style={{ marginTop: 6, fontSize: 13, color: "#767676" }}>{i.color ? `COLOR ${i.color} / ` : ""}SIZE {i.size}</div>
                {problem(i) && <div role="alert" style={{ marginTop: 6, fontSize: 12, color: "#c0392b" }}>{problem(i)}</div>}
                <form action={changeCartQty} style={{ display: "inline-flex", alignItems: "center", marginTop: 12, border: "1px solid #ccc" }}>
                  <input type="hidden" name="id" value={i.id} />
                  <button type="submit" name="delta" value="-1" aria-label="수량 줄이기" style={qtyBtn}>−</button>
                  <span style={{ padding: "8px 14px", font: "700 13px Archivo,sans-serif" }}>{i.quantity}</span>
                  <button type="submit" name="delta" value="1" aria-label="수량 늘리기" style={qtyBtn}>+</button>
                </form>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ font: "800 16px Archivo,sans-serif" }}>{won(unitPrice(i.product) * i.quantity)}</div>
                <form action={removeFromCart}>
                  <input type="hidden" name="id" value={i.id} />
                  <button type="submit" style={{ marginTop: 14, padding: 0, background: "none", border: 0, cursor: "pointer", fontSize: 12, color: "#767676" }}>삭제</button>
                </form>
              </div>
            </div>
          ))}
          <Link href="/list/best" style={{ display: "inline-block", marginTop: 24, fontSize: 13, borderBottom: "1px solid #111" }}>← 쇼핑 계속하기</Link>
        </div>

        <div style={{ background: "#f4f2ee", padding: 32, maxWidth: 460 }}>
          <div style={{ font: "800 16px Archivo,sans-serif", letterSpacing: ".08em" }}>ORDER SUMMARY</div>
          <div style={row}><span>상품금액</span><span style={{ fontFamily: "Archivo,sans-serif" }}>{won(itemsTotal)}</span></div>
          <div style={row}><span>배송비</span><span style={{ fontFamily: "Archivo,sans-serif" }}>{won(SHIPPING_FEE)}</span></div>
          <div style={row}><span>할인 금액</span><span style={{ fontFamily: "Archivo,sans-serif" }}>{won(DISCOUNT)}</span></div>
          <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid #111" }}>
            <div style={{ ...row, marginTop: 0, fontWeight: 700 }}><span>총 결제 예정금액</span><span style={{ fontFamily: "Archivo,sans-serif" }}>{won(itemsTotal + SHIPPING_FEE - DISCOUNT)}</span></div>
          </div>
          {items.length > 0 && !blocked ? (
            <Link className="btn" href="/checkout?cart=1" style={{ marginTop: 28, background: "#111", color: "#fff" }}>ORDER</Link>
          ) : (
            <span className="btn" aria-disabled="true" style={{ marginTop: 28, background: "#ccc", color: "#fff" }}>ORDER</span>
          )}
          {blocked && (
            <div role="alert" style={{ marginTop: 12, fontSize: 12, color: "#c0392b" }}>재고가 부족한 상품이 있어서 주문할 수 없어요.</div>
          )}
        </div>
      </div>
    </section>
  );
}
