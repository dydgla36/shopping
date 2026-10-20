import Link from "next/link";
import Pager from "@/components/Pager";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { fmtDate } from "@/lib/orders";
import { bodyRow, chip, h2, headRow } from "../styles";

const PER = 20;
const cols = "60px 100px 1fr 90px 100px 90px";

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requireAdmin("/admin/qna");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const status = sp.status === "waiting" || sp.status === "done" ? sp.status : undefined;
  const where = status === "waiting" ? { answer: null } : status === "done" ? { answer: { not: null } } : {};
  const [rows, total] = await Promise.all([
    prisma.question.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER, include: { user: { select: { name: true, loginId: true } } } }),
    prisma.question.count({ where }),
  ]);
  return (
    <>
      <h2 style={h2}>문의 관리</h2>
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <Link href="/admin/qna" style={chip(!status)}>전체</Link>
        <Link href="/admin/qna?status=waiting" style={chip(status === "waiting")}>답변 대기</Link>
        <Link href="/admin/qna?status=done" style={chip(status === "done")}>답변 완료</Link>
      </div>
      <p style={{ margin: "16px 0 0", fontSize: 13, color: "#767676" }}>총 {total}건</p>
      <div style={{ overflowX: "auto", marginTop: 8 }}>
        <div style={{ minWidth: 700, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>번호</span><span>유형</span><span>제목</span><span>작성자</span><span>작성일</span><span>상태</span></div>
          {rows.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>문의가 없어요.</div>}
          {rows.map((q) => (
            <div key={q.id} style={bodyRow(cols)}>
              <span style={{ color: "#767676" }}>{q.id}</span>
              <span style={{ fontSize: 13 }}>{q.category}</span>
              <Link href={`/admin/qna/${q.id}`} style={{ borderBottom: "1px solid #ccc", width: "fit-content" }}>{q.title}{q.secret && " 🔒"}</Link>
              <span>{q.user.name}</span>
              <span style={{ color: "#767676" }}>{fmtDate(q.createdAt)}</span>
              <span style={{ fontWeight: 700, color: q.answer ? "#111" : "#c0392b" }}>{q.answer ? "답변완료" : "답변대기"}</span>
            </div>
          ))}
        </div>
      </div>
      <Pager page={page} pages={Math.ceil(total / PER)} base="/admin/qna" params={{ status }} />
    </>
  );
}
