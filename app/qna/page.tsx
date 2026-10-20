import Link from "next/link";
import Pager from "@/components/Pager";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { QNA_CATEGORIES } from "@/lib/qna";
import { maskName } from "@/lib/mask";
import { fmtDate } from "@/lib/orders";
import { bodyRow, chip, crumb, darkBtn, h1, headRow, pageWrap, subtitle } from "@/lib/ui";

export const metadata = { title: "Q&A" };
const PER = 10;
const cols = "60px 100px 1fr 90px 100px 90px";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const category = sp.category && QNA_CATEGORIES.includes(sp.category) ? sp.category : undefined;
  const user = await getCurrentUser();
  const where = category ? { category } : {};
  const [rows, total] = await Promise.all([
    prisma.question.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER, include: { user: { select: { name: true } } } }),
    prisma.question.count({ where }),
  ]);
  const canSee = (q: { secret: boolean; userId: number }) => !q.secret || (user && (user.role === "ADMIN" || user.id === q.userId));

  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; Q&amp;A</div>
      <section style={pageWrap}>
        <h1 style={h1}>Q&amp;A</h1>
        <p style={subtitle}>궁금한 점을 남겨주세요</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
          <Link href="/qna" style={chip(!category)}>전체</Link>
          {QNA_CATEGORIES.map((c) => <Link key={c} href={`/qna?category=${encodeURIComponent(c)}`} style={chip(category === c)}>{c}</Link>)}
        </div>
        <div style={{ overflowX: "auto", marginTop: 28 }}>
          <div style={{ minWidth: 640, borderTop: "1px solid #111" }}>
            <div style={headRow(cols)}><span>번호</span><span>유형</span><span>제목</span><span>작성자</span><span>작성일</span><span>상태</span></div>
            {rows.length === 0 && <div style={{ padding: "40px 12px", fontSize: 14, color: "#767676" }}>등록된 문의가 없어요.</div>}
            {rows.map((q) => (
              <div key={q.id} style={bodyRow(cols)}>
                <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>{q.id}</span>
                <span style={{ color: "#555", fontSize: 13 }}>{q.category}</span>
                <Link href={`/qna/${q.id}`}>{canSee(q) ? q.title : "비밀글입니다."}{q.secret && <span style={{ marginLeft: 6, fontSize: 12, color: "#767676" }}>[비밀글]</span>}</Link>
                <span style={{ color: "#555" }}>{maskName(q.user.name)}</span>
                <span style={{ color: "#767676" }}>{fmtDate(q.createdAt)}</span>
                <span style={{ fontWeight: 700, color: q.answer ? "#111" : "#767676" }}>{q.answer ? "답변완료" : "답변대기"}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}><Link href="/qna/write" style={darkBtn}>WRITE</Link></div>
        <Pager page={page} pages={Math.ceil(total / PER)} base="/qna" params={{ category }} />
      </section>
    </>
  );
}
