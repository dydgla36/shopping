import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import { SIZES } from "@/lib/checkout";
import { won } from "@/lib/orders";

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

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const product = await getProduct((await params).id);
  if (!product) notFound();

  const related = await prisma.product.findMany({ where: { category: product.category, NOT: { id: product.id } }, orderBy: { position: "asc" }, take: 4 });

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
        </div>

        <form action="/checkout" method="get" style={{ maxWidth: 520 }}>
          <input type="hidden" name="product" value={product.id} />
          <div style={{ font: "700 13px Archivo,sans-serif", letterSpacing: ".1em", color: "#767676" }}>[브랜드명]</div>
          <h1 style={{ margin: "10px 0 0", font: "700 28px/1.35 'Noto Sans KR',sans-serif" }}>{product.name}</h1>
          <div style={{ marginTop: 14, font: "800 24px Archivo,sans-serif" }}>
            {product.sale && <em style={{ color: "#c0392b", fontStyle: "normal", marginRight: 10 }}>{product.sale}</em>}
            {won(product.price)}
          </div>
          {product.description && (
            <p style={{ margin: "18px 0 0", fontSize: 14, lineHeight: 1.8, color: "#444", whiteSpace: "pre-line" }}>{product.description}</p>
          )}
          <div style={{ marginTop: 24, borderTop: "1px solid #e5e5e5" }} />

          <div style={label}>SIZE</div>
          <div>
            {SIZES.map((s, i) => (
              <span key={s}>
                <input className="opt" type="radio" name="size" id={`size-${s}`} value={s} defaultChecked={i === 1} />
                <label htmlFor={`size-${s}`}>{s}</label>
              </span>
            ))}
          </div>
          <div style={label}>QUANTITY</div>
          <select name="qty" defaultValue="1" aria-label="수량" style={{ padding: "12px 16px", border: "1px solid #ccc", font: "500 14px Archivo,sans-serif", background: "#fff" }}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 32 }}>
            <Link className="btn" href="/cart" style={{ border: "1px solid #111" }}>ADD TO CART</Link>
            <button type="submit" className="btn" style={{ background: "#111", color: "#fff", border: 0, cursor: "pointer" }}>BUY NOW</button>
          </div>
          <div style={{ marginTop: 36, fontSize: 13, lineHeight: 1.9, color: "#555", borderTop: "1px solid #e5e5e5", paddingTop: 20 }}>
            <b style={{ color: "#111" }}>배송 안내</b> [배송비·배송 기간 안내]<br />
            <b style={{ color: "#111" }}>교환·반품</b> [교환·반품 정책 안내]
          </div>
        </form>
      </section>

      {related.length > 0 && (
        <section style={{ padding: "96px 60px 0" }}>
          <div style={{ marginBottom: 28, font: "800 26px Archivo,sans-serif" }}>YOU MAY ALSO LIKE</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "28px 20px" }}>
            {related.map((p) => (
              <ProductCard key={p.id} id={p.id} name={p.name} price={won(p.price)} bg={p.bg} sale={p.sale ?? undefined} imageUrl={p.imageUrl ?? undefined} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
