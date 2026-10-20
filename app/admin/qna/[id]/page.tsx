import Link from "next/link";
import { notFound } from "next/navigation";
import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { answerQuestion, deleteQuestion } from "@/app/actions/adminContent";
import { fmtDate } from "@/lib/orders";
import { btnLine, h2 } from "../../styles";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  await requireAdmin(`/admin/qna/${raw}`);
  const id = Number(raw);
  if (!Number.isInteger(id)) notFound();
  const q = await prisma.question.findUnique({ where: { id }, include: { user: true } });
  if (!q) notFound();
  return (
    <>
      <Link href="/admin/qna" style={{ fontSize: 13, color: "#767676" }}>← 문의 목록</Link>
      <h2 style={{ ...h2, marginTop: 12 }}>{q.title}</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#767676" }}>{q.category}{q.secret && " · 비밀글"} · {q.user.name} ({q.user.loginId}) · {fmtDate(q.createdAt)}</p>
      <div style={{ marginTop: 20, padding: "20px 0", borderTop: "1px solid #111", borderBottom: "1px solid #e5e5e5", fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-line" }}>{q.content}</div>
      <div style={{ maxWidth: 560, marginTop: 24 }}>
        <div style={{ font: "700 13px 'Noto Sans KR',sans-serif" }}>답변{q.answeredAt && <span style={{ marginLeft: 8, fontWeight: 400, color: "#767676" }}>마지막 저장 {fmtDate(q.answeredAt)}</span>}</div>
        <ActionForm action={answerQuestion} submitLabel="답변 저장">
          <input type="hidden" name="id" value={q.id} />
          <label className="fld" style={{ marginTop: 10 }}><textarea name="answer" rows={7} maxLength={3000} defaultValue={q.answer ?? ""} aria-label="답변" required /></label>
        </ActionForm>
        <form action={deleteQuestion} style={{ marginTop: 24 }}><input type="hidden" name="id" value={q.id} /><button type="submit" style={{ ...btnLine, color: "#c0392b", borderColor: "#c0392b" }}>이 문의 삭제</button></form>
      </div>
    </>
  );
}
