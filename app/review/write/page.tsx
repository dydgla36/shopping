import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { createReview } from "@/app/actions/review";
import { crumb, narrow, narrowTitle } from "@/lib/ui";

export const metadata = { title: "후기 작성" };

export default async function Page({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  const user = await requireUser(`/review/write${product ? `?product=${product}` : ""}`);

  // 취소하지 않은 주문에서 구매했고 아직 후기를 쓰지 않은 상품
  const [bought, reviewed] = await Promise.all([
    prisma.orderItem.findMany({ where: { productId: { not: null }, order: { userId: user.id, status: { not: "CANCELED" } } }, select: { productId: true, name: true }, distinct: ["productId"] }),
    prisma.review.findMany({ where: { userId: user.id }, select: { productId: true } }),
  ]);
  const done = new Set(reviewed.map((r) => r.productId));
  const options = bought.filter((b) => b.productId !== null && !done.has(b.productId));

  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/review" style={{ color: "#767676" }}>REVIEW</Link> &gt; WRITE</div>
      <section style={narrow(640)}>
        <h1 style={narrowTitle}>REVIEW WRITE</h1>
        {options.length === 0 ? (
          <p style={{ marginTop: 32, textAlign: "center", fontSize: 14, lineHeight: 1.8, color: "#555" }}>후기를 쓸 수 있는 구매 상품이 없어요.<br />구매한 상품은 상품당 후기를 한 번 쓸 수 있어요.</p>
        ) : (
          <ActionForm action={createReview} submitLabel="SUBMIT">
            <label className="fld">상품
              <select name="product" defaultValue={options.find((o) => String(o.productId) === product)?.productId ?? options[0].productId ?? ""}>
                {options.map((o) => <option key={o.productId} value={o.productId ?? ""}>{o.name}</option>)}
              </select>
            </label>
            <label className="fld">별점
              <select name="rating" defaultValue="5">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}{"☆".repeat(5 - n)} ({n}점)</option>)}
              </select>
            </label>
            <label className="fld">후기<textarea name="content" rows={7} maxLength={1000} placeholder="상품에 대한 후기를 5자 이상 남겨 주세요" required /></label>
          </ActionForm>
        )}
      </section>
    </>
  );
}
