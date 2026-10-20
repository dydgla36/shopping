import Link from "next/link";
import Pager from "@/components/Pager";
import { prisma } from "@/lib/db";
import { fmtDate } from "@/lib/orders";
import { bodyRow, crumb, h1, headRow, pageWrap, subtitle } from "@/lib/ui";

export const metadata = { title: "공지사항" };
const PER = 10;
const cols = "72px 1fr 110px";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [notices, total] = await Promise.all([
    prisma.notice.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], skip: (page - 1) * PER, take: PER }),
    prisma.notice.count(),
  ]);
  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; NOTICE</div>
      <section style={pageWrap}>
        <h1 style={h1}>NOTICE</h1>
        <p style={subtitle}>공지사항</p>
        <div style={{ overflowX: "auto", marginTop: 32 }}>
          <div style={{ minWidth: 520, borderTop: "1px solid #111" }}>
            <div style={headRow(cols)}><span>구분</span><span>제목</span><span>작성일</span></div>
            {notices.length === 0 && <div style={{ padding: "40px 12px", fontSize: 14, color: "#767676" }}>등록된 공지가 없어요.</div>}
            {notices.map((n) => (
              <div key={n.id} style={{ ...bodyRow(cols), background: n.pinned ? "#f7f6f3" : undefined }}>
                <span style={{ font: "700 12px Archivo,sans-serif", color: n.pinned ? "#111" : "#767676" }}>{n.pinned ? "NOTICE" : n.id}</span>
                <Link href={`/notice/${n.id}`} style={{ fontWeight: n.pinned ? 700 : 400 }}>{n.title}</Link>
                <span style={{ color: "#767676" }}>{fmtDate(n.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
        <Pager page={page} pages={Math.ceil(total / PER)} base="/notice" />
      </section>
    </>
  );
}
