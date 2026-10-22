import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import { groupStock, soldOutOf } from "@/lib/stock";
import { priceView } from "@/lib/orders";
import { darkBtn, narrowTitle } from "@/lib/ui";

export const metadata = { title: "검색" };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 50);
  const products = q
    ? await prisma.product.findMany({
        where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] },
        orderBy: [{ category: "asc" }, { position: "asc" }],
        take: 40,
      })
    : [];
  const stocks = groupStock(products.length ? await prisma.productStock.findMany({ where: { productId: { in: products.map((p) => p.id) } } }).catch(() => []) : []);

  return (
    <>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 0", textAlign: "center" }}>
        <h1 style={narrowTitle}>SEARCH</h1>
        <form action="/search" style={{ display: "flex", marginTop: 28, borderBottom: "2px solid #111" }}>
          <input name="q" type="search" defaultValue={q} placeholder="검색어를 입력하세요" aria-label="검색어" autoFocus style={{ flex: 1, border: 0, padding: "16px 4px", font: "400 18px 'Noto Sans KR',sans-serif", outline: "none", background: "none" }} />
          <button type="submit" style={{ ...darkBtn, background: "none", color: "#111", padding: "16px 8px", fontSize: 13 }}>SEARCH</button>
        </form>
      </section>
      <section style={{ padding: "56px 60px 0" }}>
        {q ? (
          <>
            <div style={{ padding: "16px 0", borderTop: "1px solid #111", borderBottom: "1px solid #e5e5e5", fontSize: 13 }}>‘{q}’ 검색 결과 <b>{products.length}</b>건</div>
            {products.length === 0 ? (
              <div style={{ padding: "56px 0", textAlign: "center", fontSize: 14, color: "#767676" }}>검색 결과가 없어요. 다른 검색어로 찾아보세요.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "40px 20px", marginTop: 32 }}>
                {products.map((p) => (
                  <ProductCard key={p.id} id={p.id} name={p.name} {...priceView(p.price, p.sale)} bg={p.bg} sale={p.sale ?? undefined} imageUrl={p.imageUrl ?? undefined} soldOut={p.soldOut || soldOutOf(stocks.get(p.id) ?? {})} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: "24px 0", textAlign: "center", fontSize: 14, color: "#767676" }}>상품 이름이나 설명으로 검색할 수 있어요.</div>
        )}
      </section>
    </>
  );
}
