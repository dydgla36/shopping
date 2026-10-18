import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { lists } from "@/lib/lists";
import { getProducts } from "@/lib/products";

// 요청할 때마다 DB에서 읽도록 합니다. (빌드 시점에는 DB에 접속하지 않음)
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: lists[slug]?.title };
}

export default async function ListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const list = lists[slug];
  if (!list) notFound();
  const items = await getProducts(slug);

  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: 12, color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; {list.title}
      </div>
      <section style={{ padding: "20px 60px 0" }}>
        <h1 style={{ margin: 0, font: "800 40px Archivo,sans-serif", letterSpacing: ".04em" }}>{list.title}</h1>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "#555" }}>{list.sub}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
          {list.chips.map((chip, i) => (
            <a
              key={chip}
              href="#"
              style={{ padding: "10px 18px", border: `1px solid ${i === 0 ? "#111" : "#ccc"}`, background: i === 0 ? "#111" : undefined, color: i === 0 ? "#fff" : undefined, font: "500 13px 'Noto Sans KR',sans-serif" }}
            >
              {chip}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 28, padding: "16px 0", borderTop: "1px solid #111", borderBottom: "1px solid #e5e5e5", fontSize: 13 }}>
          <span>총 <b>[000]</b>개의 상품</span>
          <span style={{ display: "flex", gap: 18 }}>
            <a href="#" style={{ fontWeight: 700 }}>신상품순</a>
            <a href="#" style={{ color: "#767676" }}>인기순</a>
            <a href="#" style={{ color: "#767676" }}>낮은가격순</a>
            <a href="#" style={{ color: "#767676" }}>높은가격순</a>
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "40px 20px", marginTop: 32 }}>
          {items.map((item) => (
            <ProductCard key={item.name} {...item} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 64 }}>
          {["1", "2", "3", "4", "→"].map((t, i) => (
            <a key={t} href="#" style={{ minWidth: 40, padding: "10px 0", textAlign: "center", font: "700 14px Archivo,sans-serif", borderBottom: i === 0 ? "2px solid #111" : undefined, color: i === 0 ? undefined : "#767676" }}>
              {t}
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
