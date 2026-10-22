import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { deleteProduct, deleteRemovedCategoryProducts, toggleSoldOut } from "@/app/actions/admin";
import { lists } from "@/lib/lists";
import { saleRate, unitPrice, won } from "@/lib/orders";
import { LOW_STOCK, groupStock } from "@/lib/stock";
import { SIZES } from "@/lib/checkout";
import { bodyRow, btnDark, btnLine, h2, headRow, notice } from "../styles";

const cols = "110px 1.5fr 110px 60px 1.2fr 250px";
const badge = { display: "inline-block", marginRight: 4, padding: "1px 6px", background: "#111", color: "#fff", fontSize: 10, letterSpacing: ".04em" } as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin("/admin/products");
  const sp = await searchParams;
  const products = await prisma.product.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 200 });
  const removed = products.filter((p) => !lists[p.category]);
  const stocks = groupStock(await prisma.productStock.findMany({ where: { productId: { in: products.map((p) => p.id) } } }).catch(() => []));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h2 style={h2}>상품 관리</h2>
        <Link href="/admin/products/new" style={{ ...btnDark, display: "inline-block" }}>+ 상품 추가</Link>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#767676" }}>여기서 바꾼 내용은 카테고리 목록과 상품 상세 페이지에 바로 반영돼요. 상품이 하나도 없으면 목록 화면은 샘플 상품을 대신 보여줘요. 최근에 등록한 상품이 위에 보여요.</p>
      {removed.length > 0 && (
        <div role="alert" style={{ marginTop: 16, padding: "14px 16px", background: "#fbeeee", color: "#c0392b", fontSize: 13, lineHeight: 1.8 }}>
          없어진 카테고리({Array.from(new Set(removed.map((p) => p.category))).join(", ")})에 상품 {removed.length}개가 남아 있어요. 이 상품들은 사이트 어디에도 보이지 않아요.
          <form action={deleteRemovedCategoryProducts} style={{ marginTop: 10 }}>
            <button type="submit" style={{ ...btnLine, color: "#c0392b", borderColor: "#c0392b" }}>이 상품 {removed.length}개 모두 삭제</button>
          </form>
        </div>
      )}
      {sp.saved && <div style={notice(true)} role="status">저장했어요.</div>}
      {sp.error && <div style={notice(false)} role="alert">{sp.error}</div>}

      <div style={{ overflowX: "auto", marginTop: 24 }}>
        <div style={{ minWidth: 900, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>카테고리</span><span>이름 · 하위 분류</span><span>가격</span><span>할인</span><span>재고</span><span /></div>
          {products.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>등록된 상품이 없어요.</div>}
          {products.map((p) => (
            <div key={p.id} style={{ ...bodyRow(cols), opacity: p.soldOut ? 0.7 : 1 }}>
              <span style={{ fontSize: 12 }}>
                <span style={{ color: "#767676" }}>{p.category === "women" ? "women" : p.category}</span>
                <br />
                {(p.inBest || p.category === "best") && <span style={badge}>BEST</span>}
                {(p.inNew || p.category === "new") && <span style={badge}>NEW</span>}
              </span>
              <span>
                <Link href={`/admin/products/${p.id}`} style={{ borderBottom: "1px solid #ccc", width: "fit-content" }}>{p.name}</Link>
                {p.soldOut && <span style={{ ...badge, marginLeft: 6, background: "#c0392b" }}>품절</span>}
                <span style={{ display: "block", marginTop: 2, fontSize: 11, color: "#767676" }}>{p.subCategory ?? "하위 분류 없음"}</span>
              </span>
              <span style={{ fontFamily: "Archivo,sans-serif" }}>{saleRate(p.sale) ? <>{won(unitPrice(p))}<br /><s style={{ fontSize: 11, color: "#767676" }}>{won(p.price)}</s></> : won(p.price)}</span>
              <span>{p.sale ?? "-"}</span>
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
              <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Link href={`/admin/products/${p.id}`} style={{ ...btnLine, display: "inline-block" }}>EDIT</Link>
                <form action={toggleSoldOut}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" style={p.soldOut ? btnLine : { ...btnLine, color: "#b9770e", borderColor: "#b9770e" }}>{p.soldOut ? "품절 해제" : "품절 처리"}</button>
                </form>
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
