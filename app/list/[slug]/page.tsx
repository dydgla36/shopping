import Link from "next/link";
import { notFound } from "next/navigation";
import Pager from "@/components/Pager";
import ProductCard from "@/components/ProductCard";
import { SORTS, SUB_CATEGORIES, type SortKey } from "@/lib/categories";
import { lists } from "@/lib/lists";
import { getListProducts } from "@/lib/products";
import { chip } from "@/lib/ui";

// 요청할 때마다 DB에서 읽도록 합니다. (빌드 시점에는 DB에 접속하지 않음)
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: lists[slug]?.title };
}

export default async function ListPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ sub?: string; sort?: string; page?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const list = lists[slug];
  if (!list) notFound();

  const sub = sp.sub && SUB_CATEGORIES.includes(sp.sub) ? sp.sub : undefined;
  const sort: SortKey = SORTS.find(([k]) => k === sp.sort)?.[0] ?? "new";
  const page = Math.max(1, Number(sp.page) || 1);
  const { items, total, pages, failed } = await getListProducts(slug, { sub, sort, page });

  // 분류·정렬을 바꿀 때 서로 유지하고, 페이지는 1로 돌아갑니다.
  const href = (over: { sub?: string; sort?: string }) => {
    const cur: Record<string, string | undefined> = { sub, sort: sort === "new" ? undefined : sort, ...over };
    const q = new URLSearchParams();
    Object.entries(cur).forEach(([k, v]) => v && q.set(k, v));
    const s = q.toString();
    return s ? `/list/${slug}?${s}` : `/list/${slug}`;
  };

  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: 12, color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; {list.title}
      </div>
      <section style={{ padding: "20px 60px 0" }}>
        <h1 style={{ margin: 0, font: "800 40px Archivo,sans-serif", letterSpacing: ".04em" }}>{list.title}</h1>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "#555" }}>{list.sub}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
          <Link href={href({ sub: undefined })} style={chip(!sub)}>전체</Link>
          {SUB_CATEGORIES.map((c) => <Link key={c} href={href({ sub: c })} style={chip(sub === c)}>{c}</Link>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 28, padding: "16px 0", borderTop: "1px solid #111", borderBottom: "1px solid #e5e5e5", fontSize: 13 }}>
          <span>총 <b>{total.toLocaleString("ko-KR")}</b>개의 상품</span>
          <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {SORTS.map(([key, label]) => (
              <Link key={key} href={href({ sort: key === "new" ? undefined : key })} style={{ fontWeight: sort === key ? 700 : 400, color: sort === key ? "#111" : "#767676" }}>{label}</Link>
            ))}
          </span>
        </div>
        {items.length === 0 ? (
          <div style={{ padding: "64px 0", textAlign: "center", fontSize: 14, color: "#767676" }}>{failed ? "상품을 불러오지 못했어요. 잠시 후 다시 시도해 주세요." : "조건에 맞는 상품이 없어요."}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "40px 20px", marginTop: 32 }}>
            {items.map((item) => <ProductCard key={item.id} {...item} />)}
          </div>
        )}
        <Pager page={page} pages={pages} base={`/list/${slug}`} params={{ sub, sort: sort === "new" ? undefined : sort }} />
      </section>
    </>
  );
}
