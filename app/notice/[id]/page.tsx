import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { fmtDate } from "@/lib/orders";
import { crumb, lineBtn } from "@/lib/ui";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) notFound();
  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/notice" style={{ color: "#767676" }}>NOTICE</Link> &gt; 공지</div>
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "28px 24px 0" }}>
        <h1 style={{ margin: 0, font: "700 26px/1.4 'Noto Sans KR',sans-serif" }}>{notice.title}</h1>
        <div style={{ marginTop: 10, fontSize: 13, color: "#767676" }}>{fmtDate(notice.createdAt)}</div>
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #111", fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-line" }}>{notice.content}</div>
        <div style={{ marginTop: 48 }}><Link href="/notice" style={lineBtn}>목록으로</Link></div>
      </section>
    </>
  );
}
