import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { maskName } from "@/lib/mask";
import { fmtDate } from "@/lib/orders";
import { box, crumb, lineBtn } from "@/lib/ui";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const q = await prisma.question.findUnique({ where: { id }, include: { user: { select: { name: true } } } });
  if (!q) notFound();
  const user = await getCurrentUser();
  const canSee = !q.secret || (user && (user.role === "ADMIN" || user.id === q.userId));

  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/qna" style={{ color: "#767676" }}>Q&amp;A</Link> &gt; 문의</div>
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "28px 24px 0" }}>
        {canSee ? (
          <>
            <div style={{ fontSize: 12, color: "#767676" }}>{q.category}{q.secret && " · 비밀글"}</div>
            <h1 style={{ margin: "8px 0 0", font: "700 24px/1.4 'Noto Sans KR',sans-serif" }}>{q.title}</h1>
            <div style={{ marginTop: 10, fontSize: 13, color: "#767676" }}>{maskName(q.user.name)} · {fmtDate(q.createdAt)}</div>
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #111", fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-line" }}>{q.content}</div>
            <div style={{ ...box, marginTop: 32 }}>
              <div style={{ font: "700 13px Archivo,sans-serif", letterSpacing: ".08em" }}>ANSWER</div>
              {q.answer ? (
                <>
                  <div style={{ marginTop: 12, fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-line" }}>{q.answer}</div>
                  {q.answeredAt && <div style={{ marginTop: 12, fontSize: 12, color: "#767676" }}>{fmtDate(q.answeredAt)}</div>}
                </>
              ) : (
                <div style={{ marginTop: 12, fontSize: 14, color: "#767676" }}>아직 답변이 등록되지 않았어요.</div>
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: "60px 0", textAlign: "center", fontSize: 14, color: "#555" }}>비밀글은 작성자와 관리자만 볼 수 있어요.</div>
        )}
        <div style={{ marginTop: 48 }}><Link href="/qna" style={lineBtn}>목록으로</Link></div>
      </section>
    </>
  );
}
