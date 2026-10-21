import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { SIZES } from "@/lib/checkout";
import { LOW_STOCK, soldOutOf, stockMap, type StockMap } from "@/lib/stock";
import { priceView, won } from "@/lib/orders";
import { addToCart, buyNow } from "@/app/actions/cart";
import { toggleWishlist } from "@/app/actions/wishlist";
import { maskName } from "@/lib/mask";
import { fmtDate } from "@/lib/orders";
import { stars } from "@/lib/ui";

// 관리자가 DB에 등록한 상품의 상세 페이지입니다. (/product/상품번호)
export const dynamic = "force-dynamic";

async function getProduct(raw: string) {
  const id = Number(raw);
  if (!Number.isInteger(id) || !process.env.DATABASE_URL) return null;
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch (e) {
    console.error("상품 조회 실패:", e);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const product = await getProduct((await params).id);
  return { title: product?.name ?? "상품 상세" };
}

const label = { font: "700 12px Archivo,sans-serif", letterSpacing: ".1em", color: "#767676", margin: "28px 0 10px" } as const;

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const product = await getProduct((await params).id);
  if (!product) notFound();
  const { error } = await searchParams;
  const user = await getCurrentUser();

  // 재고·관심 상품 테이블이 아직 없어도 상세 화면은 보이게 합니다.
  const [stock, wished, related] = await Promise.all([
    stockMap(product.id).catch((): StockMap => ({})),
    user ? prisma.wishlistItem.findUnique({ where: { userId_productId: { userId: user.id, productId: product.id } } }).catch(() => null) : null,
    prisma.product.findMany({ where: { category: product.category, NOT: { id: product.id } }, orderBy: { position: "asc" }, take: 4 }),
  ]);
  // 후기 (후기 테이블이 아직 없어도 상세 화면은 보이게 합니다)
  const [reviews, reviewAgg] = await Promise.all([
    prisma.review.findMany({ where: { productId: product.id }, orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { name: true } } } }).catch(() => []),
    prisma.review.aggregate({ where: { productId: product.id }, _avg: { rating: true }, _count: { _all: true } }).catch(() => null),
  ]);
  const soldOut = soldOutOf(stock);
  const pv = priceView(product.price, product.sale);
  const firstAvailable = ["M", ...SIZES].find((s) => stock[s] !== 0) ?? "M"; // 품절이 아닌 사이즈를 기본 선택

  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: 12, color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href={`/list/${product.category}`} style={{ color: "#767676" }}>{product.category.toUpperCase()}</Link> &gt; {product.name}
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 56, padding: "28px 60px 0" }}>
        <div style={{ aspectRatio: "4/5", background: product.bg, position: "relative", overflow: "hidden" }}>
          {product.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          {soldOut && (
            <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 0", textAlign: "center", background: "rgba(17,17,17,.85)", color: "#fff", font: "700 13px Archivo,sans-serif", letterSpacing: ".12em" }}>SOLD OUT</span>
          )}
        </div>

        <form action={addToCart} style={{ maxWidth: 520 }}>
          <input type="hidden" name="product" value={product.id} />
          <div style={{ font: "700 13px Archivo,sans-serif", letterSpacing: ".1em", color: "#767676" }}>[브랜드명]</div>
          <h1 style={{ margin: "10px 0 0", font: "700 28px/1.35 'Noto Sans KR',sans-serif" }}>{product.name}</h1>
          <div style={{ marginTop: 14, font: "800 24px Archivo,sans-serif" }}>
            {pv.finalPrice ? (
              <>
                <s style={{ marginRight: 10, fontSize: 16, fontWeight: 400, color: "#767676" }}>{pv.price}</s>
                <em style={{ color: "#c0392b", fontStyle: "normal", marginRight: 10 }}>{product.sale}</em>
                {pv.finalPrice}
              </>
            ) : (
              pv.price
            )}
          </div>
          {product.description && (
            <p style={{ margin: "18px 0 0", fontSize: 14, lineHeight: 1.8, color: "#444", whiteSpace: "pre-line" }}>{product.description}</p>
          )}
          {error && <div role="alert" style={{ margin: "18px 0 0", padding: "12px 16px", fontSize: 13, background: "#fbeeee", color: "#c0392b" }}>{error}</div>}
          <div style={{ marginTop: 24, borderTop: "1px solid #e5e5e5" }} />

          <div style={label}>SIZE</div>
          <div>
            {SIZES.map((s) => {
              const q = stock[s];
              const text = q === 0 ? `${s} (품절)` : q !== undefined && q <= LOW_STOCK ? `${s} (${q}개 남음)` : s;
              return (
                <span key={s}>
                  <input className="opt" type="radio" name="size" id={`size-${s}`} value={s} defaultChecked={s === firstAvailable} disabled={q === 0} />
                  <label htmlFor={`size-${s}`}>{text}</label>
                </span>
              );
            })}
          </div>
          <div style={label}>QUANTITY</div>
          <select name="qty" defaultValue="1" aria-label="수량" style={{ padding: "12px 16px", border: "1px solid #ccc", font: "500 14px Archivo,sans-serif", background: "#fff" }}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>

          {soldOut ? (
            <button type="button" disabled className="btn" style={{ width: "100%", marginTop: 32, background: "#ccc", color: "#fff", border: 0 }}>SOLD OUT</button>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 32 }}>
              <button type="submit" className="btn" style={{ background: "#fff", color: "#111", border: "1px solid #111", cursor: "pointer" }}>ADD TO CART</button>
              <button type="submit" formAction={buyNow} className="btn" style={{ background: "#111", color: "#fff", border: 0, cursor: "pointer" }}>BUY NOW</button>
            </div>
          )}
          <button type="submit" formAction={toggleWishlist} formNoValidate aria-pressed={!!wished} className="btn" style={{ width: "100%", marginTop: 10, background: "#fff", color: "#111", border: "1px solid #ccc", cursor: "pointer" }}>
            {wished ? "♥ WISHLIST" : "♡ WISHLIST"}
          </button>
          {!user && <p style={{ margin: "10px 0 0", fontSize: 12, lineHeight: 1.7, color: "#767676" }}>비회원도 BUY NOW로 바로 주문할 수 있어요. 장바구니와 관심 상품은 로그인이 필요해요.</p>}
          <div style={{ marginTop: 36, fontSize: 13, lineHeight: 1.9, color: "#555", borderTop: "1px solid #e5e5e5", paddingTop: 20 }}>
            <b style={{ color: "#111" }}>배송 안내</b> [배송비·배송 기간 안내]<br />
            <b style={{ color: "#111" }}>교환·반품</b> [교환·반품 정책 안내]
          </div>
        </form>
      </section>

      <section style={{ padding: "72px 60px 0", maxWidth: 960 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, paddingBottom: 14, borderBottom: "1px solid #111" }}>
          <div style={{ font: "800 22px Archivo,sans-serif" }}>REVIEW{reviewAgg && reviewAgg._count._all > 0 && <span style={{ marginLeft: 12, fontSize: 15, fontWeight: 700 }}>★ {reviewAgg._avg.rating?.toFixed(1)} <span style={{ color: "#767676", fontWeight: 400 }}>({reviewAgg._count._all})</span></span>}</div>
          <Link href={`/review?product=${product.id}`} style={{ fontSize: 13, borderBottom: "1px solid #111" }}>후기 전체 보기</Link>
        </div>
        {reviews.length === 0 && <div style={{ padding: "28px 0", fontSize: 14, color: "#767676" }}>아직 후기가 없어요.</div>}
        {reviews.map((r) => (
          <div key={r.id} style={{ padding: "20px 0", borderBottom: "1px solid #e5e5e5" }}>
            <div aria-label={`별점 ${r.rating}점`} style={{ font: "700 14px Archivo,sans-serif", letterSpacing: ".1em" }}>{stars(r.rating)}</div>
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>{r.content}</p>
            <div style={{ marginTop: 10, fontSize: 12, color: "#767676" }}>{maskName(r.user.name)} · {fmtDate(r.createdAt)}</div>
          </div>
        ))}
      </section>

      {related.length > 0 && (
        <section style={{ padding: "96px 60px 0" }}>
          <div style={{ marginBottom: 28, font: "800 26px Archivo,sans-serif" }}>YOU MAY ALSO LIKE</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "28px 20px" }}>
            {related.map((p) => (
              <ProductCard key={p.id} id={p.id} name={p.name} {...priceView(p.price, p.sale)} bg={p.bg} sale={p.sale ?? undefined} imageUrl={p.imageUrl ?? undefined} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
