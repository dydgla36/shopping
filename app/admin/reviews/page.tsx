import Link from "next/link";
import Pager from "@/components/Pager";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { deleteReview } from "@/app/actions/adminContent";
import { fmtDate } from "@/lib/orders";
import { stars } from "@/lib/ui";
import { bodyRow, btnLine, h2, headRow } from "../styles";

const PER = 20;
const cols = "90px 1fr 1.6fr 110px 70px";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin("/admin/reviews");
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [rows, total] = await Promise.all([
    prisma.review.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER, include: { user: { select: { name: true } }, product: { select: { id: true, name: true } } } }),
    prisma.review.count(),
  ]);
  return (
    <>
      <h2 style={h2}>후기 관리</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#767676" }}>부적절한 후기는 삭제할 수 있어요. 총 {total}건</p>
      <div style={{ overflowX: "auto", marginTop: 20 }}>
        <div style={{ minWidth: 760, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>별점</span><span>상품</span><span>내용</span><span>작성자·날짜</span><span /></div>
          {rows.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>후기가 없어요.</div>}
          {rows.map((r) => (
            <div key={r.id} style={bodyRow(cols)}>
              <span style={{ font: "700 13px Archivo,sans-serif" }}>{stars(r.rating)}</span>
              <Link href={`/product/${r.product.id}`} style={{ fontSize: 13 }}>{r.product.name}</Link>
              <span style={{ fontSize: 13, color: "#444", whiteSpace: "pre-line", wordBreak: "break-word" }}>{r.content}</span>
              <span style={{ fontSize: 12, color: "#767676" }}>{r.user.name}<br />{fmtDate(r.createdAt)}</span>
              <form action={deleteReview}><input type="hidden" name="id" value={r.id} /><button type="submit" style={{ ...btnLine, color: "#c0392b", borderColor: "#c0392b" }}>DEL</button></form>
            </div>
          ))}
        </div>
      </div>
      <Pager page={page} pages={Math.ceil(total / PER)} base="/admin/reviews" />
    </>
  );
}
