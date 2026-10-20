import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { deleteProduct } from "@/app/actions/admin";
import { won } from "@/lib/orders";
import { LOW_STOCK, groupStock } from "@/lib/stock";
import { SIZES } from "@/lib/checkout";
import { bodyRow, btnDark, btnLine, h2, headRow, notice } from "../styles";

const cols = "90px 1.4fr 110px 70px 70px 1.3fr 140px";

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin("/admin/products");
  const sp = await searchParams;
  const products = await prisma.product.findMany({ orderBy: [{ category: "asc" }, { position: "asc" }], take: 200 });
  const stocks = groupStock(await prisma.productStock.findMany({ where: { productId: { in: products.map((p) => p.id) } } }).catch(() => []));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h2 style={h2}>상품 관리</h2>
        <Link href="/admin/products/new" style={{ ...btnDark, display: "inline-block" }}>+ 상품 추가</Link>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#767676" }}>여기서 바꾼 내용은 카테고리 목록과 상품 상세 페이지에 바로 반영돼요. 상품이 하나도 없으면 목록 화면은 샘플 상품을 대신 보여줘요.</p>
      {sp.saved && <div style={notice(true)} role="status">저장했어요.</div>}
      {sp.error && <div style={notice(false)} role="alert">{sp.error}</div>}

      <div style={{ overflowX: "auto", marginTop: 24 }}>
        <div style={{ minWidth: 820, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>카테고리</span><span>이름</span><span>가격</span><span>할인</span><span>순서</span><span>재고</span><span /></div>
          {products.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>등록된 상품이 없어요.</div>}
          {products.map((p) => (
            <div key={p.id} style={bodyRow(cols)}>
              <span style={{ color: "#767676" }}>{p.category}</span>
              <Link href={`/admin/products/${p.id}`} style={{ borderBottom: "1px solid #ccc", width: "fit-content" }}>{p.name}</Link>
              <span style={{ fontFamily: "Archivo,sans-serif" }}>{won(p.price)}</span>
              <span>{p.sale ?? "-"}</span>
              <span>{p.position}</span>
              <span style={{ fontSize: 12 }}>
                {SIZES.map((s, n) => {
                  const q = stocks.get(p.id)?.[s];
                  return (
                    <span key={s} style={{ color: q === 0 ? "#c0392b" : q !== undefined && q <= LOW_STOCK ? "#b9770e" : "#555", fontWeight: q !== undefined && q <= LOW_STOCK ? 700 : 400 }}>
                      {n > 0 && " · "}{s} {q === undefined ? "∞" : q === 0 ? "품절" : q}
                    </span>
                  );
                })}
              </span>
              <span style={{ display: "flex", gap: 6 }}>
                <Link href={`/admin/products/${p.id}`} style={{ ...btnLine, display: "inline-block" }}>EDIT</Link>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" style={{ ...btnLine, color: "#c0392b", borderColor: "#c0392b" }}>DEL</button>
                </form>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
