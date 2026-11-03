import Link from "next/link";
import ReviewForm from "@/components/ReviewForm";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PHOTO_REVIEW_POINT, REVIEW_POINT, REVIEW_POINT_MIN_LENGTH, won } from "@/lib/orders";
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
          <>
            <p style={{ margin: "20px 0 0", padding: "12px 16px", background: "#f4f2ee", fontSize: 13, lineHeight: 1.7, color: "#444" }}>
              {REVIEW_POINT_MIN_LENGTH}자 이상 후기를 쓰면 적립금 {won(REVIEW_POINT)}, 사진을 함께 붙이면 {won(PHOTO_REVIEW_POINT)}이 적립돼요.
            </p>
            <ReviewForm options={options.map((o) => ({ productId: o.productId as number, name: o.name }))} defaultProduct={Number(options.find((o) => String(o.productId) === product)?.productId ?? options[0]?.productId)} />
          </>
        )}
      </section>
    </>
  );
}
