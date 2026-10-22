import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { removeFromWishlist } from "@/app/actions/wishlist";
import { groupStock, soldOutOf } from "@/lib/stock";
import { priceView } from "@/lib/orders";

export const metadata = { title: "관심 상품" };

export default async function Page() {
  const user = await requireUser("/wishlist");
  const items = await prisma.wishlistItem.findMany({ where: { userId: user.id }, include: { product: true }, orderBy: { createdAt: "desc" } });
  const stocks = groupStock(await prisma.productStock.findMany({ where: { productId: { in: items.map((i) => i.productId) } } }).catch(() => []));

  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: 12, color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/mypage" style={{ color: "#767676" }}>MY PAGE</Link> &gt; WISHLIST
      </div>
      <section style={{ padding: "20px 60px 0" }}>
        <h1 style={{ margin: 0, font: "800 40px Archivo,sans-serif", letterSpacing: ".04em" }}>WISHLIST</h1>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "#555" }}>관심 상품 <b>{items.length}</b>개</p>
        <div style={{ marginTop: 28, borderTop: "1px solid #111" }} />
        {items.length === 0 ? (
          <div style={{ padding: "48px 0", fontSize: 14, color: "#767676" }}>
            아직 담은 상품이 없어요. 상품 상세 화면에서 <b>♡ WISHLIST</b>를 눌러 담아 보세요.
            <div style={{ marginTop: 20 }}><Link href="/list/best" style={{ borderBottom: "1px solid #111", color: "#111" }}>BEST 상품 보러 가기</Link></div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "40px 20px", marginTop: 32 }}>
            {items.map((i) => (
              <div key={i.id}>
                <ProductCard id={i.productId} name={i.product.name} {...priceView(i.product.price, i.product.sale)} bg={i.product.bg} sale={i.product.sale ?? undefined} imageUrl={i.product.imageUrl ?? undefined} soldOut={i.product.soldOut || soldOutOf(stocks.get(i.productId) ?? {})} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginTop: 12 }}>
                  <Link href={`/product/${i.productId}`} style={{ textAlign: "center", padding: 12, border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>OPTION &amp; CART</Link>
                  <form action={removeFromWishlist}>
                    <input type="hidden" name="id" value={i.id} />
                    <button type="submit" style={{ padding: "12px 16px", border: "1px solid #ccc", background: "#fff", fontSize: 12, color: "#555", cursor: "pointer" }}>삭제</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
