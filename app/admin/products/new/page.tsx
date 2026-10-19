import Link from "next/link";
import ProductForm from "@/components/ProductForm";
import { requireAdmin } from "@/lib/admin";
import { lists } from "@/lib/lists";
import { h2 } from "../../styles";

export default async function Page() {
  await requireAdmin("/admin/products/new");
  return (
    <>
      <Link href="/admin/products" style={{ fontSize: 13, color: "#767676" }}>← 상품 목록</Link>
      <h2 style={{ ...h2, marginTop: 12 }}>상품 추가</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#767676" }}>추가한 상품은 선택한 카테고리 목록(/list/...)에 나타나고, 누르면 상품 상세 페이지가 열려요.</p>
      <ProductForm categories={Object.keys(lists)} />
    </>
  );
}
