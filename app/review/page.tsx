import Link from "next/link";
import Pager from "@/components/Pager";
import { prisma } from "@/lib/db";
import { maskName } from "@/lib/mask";
import { fmtDate } from "@/lib/orders";
import { box, crumb, darkBtn, h1, pageWrap, stars, subtitle } from "@/lib/ui";

export const metadata = { title: "후기" };
const PER = 10;

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; product?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const productId = Number.isInteger(Number(sp.product)) && sp.product ? Number(sp.product) : undefined;
  const where = productId ? { productId } : {};
  const [rows, total, agg, product] = await Promise.all([
    prisma.review.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER, include: { user: { select: { name: true } }, product: { select: { id: true, name: true } } } }),
    prisma.review.count({ where }),
    prisma.review.aggregate({ where, _avg: { rating: true } }),
    productId ? prisma.product.findUnique({ where: { id: productId }, select: { id: true, name: true } }) : null,
  ]);

  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; REVIEW</div>
      <section style={{ ...pageWrap, maxWidth: 960, margin: "0 auto" }}>
        <h1 style={h1}>REVIEW</h1>
        <p style={subtitle}>{product ? <>‘{product.name}’ 후기 · <Link href="/review" style={{ borderBottom: "1px solid #555" }}>전체 후기 보기</Link></> : "구매 후기"}</p>
        <div style={{ ...box, display: "flex", gap: 48, flexWrap: "wrap", marginTop: 28 }}>
          <div><div style={{ font: "700 12px Archivo,sans-serif", letterSpacing: ".1em", color: "#767676" }}>평균 평점</div><div style={{ marginTop: 6, font: "800 32px Archivo,sans-serif" }}>{agg._avg.rating ? agg._avg.rating.toFixed(1) : "-"} <span style={{ fontSize: 16, color: "#767676" }}>/ 5</span></div></div>
          <div><div style={{ font: "700 12px Archivo,sans-serif", letterSpacing: ".1em", color: "#767676" }}>후기 수</div><div style={{ marginTop: 6, font: "800 32px Archivo,sans-serif" }}>{total}</div></div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, paddingBottom: 16, borderBottom: "1px solid #111" }}><Link href={productId ? `/review/write?product=${productId}` : "/review/write"} style={darkBtn}>WRITE</Link></div>
        {rows.length === 0 && <div style={{ padding: "48px 0", fontSize: 14, color: "#767676" }}>아직 후기가 없어요. 구매한 상품의 첫 후기를 남겨 보세요.</div>}
        {rows.map((r) => (
          <div key={r.id} style={{ padding: "28px 0", borderBottom: "1px solid #e5e5e5" }}>
            <div aria-label={`별점 ${r.rating}점`} style={{ font: "700 15px Archivo,sans-serif", letterSpacing: ".1em" }}>{stars(r.rating)}</div>
            <Link href={`/product/${r.product.id}`} style={{ display: "block", marginTop: 8, fontSize: 14, color: "#555" }}>{r.product.name}</Link>
            <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>{r.content}</p>
            <div style={{ marginTop: 14, fontSize: 12, color: "#767676" }}>{maskName(r.user.name)} · {fmtDate(r.createdAt)}</div>
          </div>
        ))}
        <Pager page={page} pages={Math.ceil(total / PER)} base="/review" params={{ product: productId ? String(productId) : undefined }} />
      </section>
    </>
  );
}
