import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { lists } from "@/lib/lists";
import { h2 } from "../../styles";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  await requireAdmin(`/admin/products/${raw}`);
  const id = Number(raw);
  if (!Number.isInteger(id)) notFound();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  const stockRows = await prisma.productStock.findMany({ where: { productId: id } }).catch(() => []);
  const stock = Object.fromEntries(stockRows.map((r) => [r.size, r.quantity]));

  return (
    <>
      <Link href="/admin/products" style={{ fontSize: 13, color: "#767676" }}>← 상품 목록</Link>
      <h2 style={{ ...h2, marginTop: 12 }}>상품 수정</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13 }}>
        <Link href={`/product/${product.id}`} style={{ borderBottom: "1px solid #111" }}>상품 상세 페이지 보기</Link>
      </p>
      <ProductForm
        categories={Object.keys(lists)}
        product={{ id: product.id, category: product.category, name: product.name, price: product.price, sale: product.sale, position: product.position, bg: product.bg, imageUrl: product.imageUrl, description: product.description, stock }}
      />
    </>
  );
}
