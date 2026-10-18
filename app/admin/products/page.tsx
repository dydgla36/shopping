import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { addProduct, deleteProduct, saveProduct } from "@/app/actions/admin";
import { lists } from "@/lib/lists";
import { btnDark, btnLine, h2, headRow, input, notice } from "../styles";

const cols = "90px 1.6fr 110px 80px 80px 150px";

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin("/admin/products");
  const sp = await searchParams;
  const products = await prisma.product.findMany({ orderBy: [{ category: "asc" }, { position: "asc" }], take: 200 });

  return (
    <>
      <h2 style={h2}>상품 관리</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#767676" }}>여기서 바꾼 내용은 카테고리 목록 화면(/list/...)에 바로 반영돼요. 상품이 하나도 없으면 화면은 샘플 상품을 대신 보여줘요.</p>
      {sp.saved && <div style={notice(true)} role="status">저장했어요.</div>}
      {sp.error && <div style={notice(false)} role="alert">{sp.error}</div>}

      <form action={addProduct} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24, padding: 16, background: "#f4f2ee", alignItems: "center" }}>
        <select name="category" aria-label="카테고리" style={{ ...input, width: 110 }}>
          {Object.keys(lists).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="name" placeholder="상품 이름" aria-label="상품 이름" required style={{ ...input, flex: "1 1 180px", width: "auto" }} />
        <input name="price" type="number" min={0} placeholder="가격(원)" aria-label="가격" required style={{ ...input, width: 110 }} />
        <input name="sale" placeholder="할인 (예: 7%)" aria-label="할인" style={{ ...input, width: 110 }} />
        <input name="position" type="number" placeholder="순서" aria-label="순서" style={{ ...input, width: 80 }} />
        <button type="submit" style={btnDark}>ADD</button>
      </form>

      <div style={{ overflowX: "auto", marginTop: 24 }}>
        <div style={{ minWidth: 760, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>카테고리</span><span>이름</span><span>가격(원)</span><span>할인</span><span>순서</span><span /></div>
          {products.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>등록된 상품이 없어요.</div>}
          {products.map((p) => (
            <form key={p.id} action={saveProduct} style={{ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "10px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", fontSize: 14 }}>
              <input type="hidden" name="id" value={p.id} />
              <span style={{ color: "#767676" }}>{p.category}</span>
              <input name="name" defaultValue={p.name} aria-label="상품 이름" style={input} />
              <input name="price" type="number" min={0} defaultValue={p.price} aria-label="가격" style={input} />
              <input name="sale" defaultValue={p.sale ?? ""} aria-label="할인" style={input} />
              <input name="position" type="number" defaultValue={p.position} aria-label="순서" style={input} />
              <span style={{ display: "flex", gap: 6 }}>
                <button type="submit" style={btnLine}>SAVE</button>
                <button type="submit" formAction={deleteProduct} style={{ ...btnLine, color: "#c0392b", borderColor: "#c0392b" }}>DEL</button>
              </span>
            </form>
          ))}
        </div>
      </div>
    </>
  );
}
