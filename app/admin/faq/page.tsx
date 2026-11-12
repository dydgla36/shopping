import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { deleteFaq, saveFaq } from "@/app/actions/adminContent";
import { FAQ_CATEGORIES } from "@/lib/faq";
import { btnLine, h2 } from "../styles";

export default async function Page() {
  await requireAdmin("/admin/faq");
  const faqs = await prisma.faq.findMany({ orderBy: [{ position: "asc" }, { id: "asc" }], take: 200 });
  const fields = (f?: { category: string; question: string; answer: string; position: number }) => (
    <>
      <label className="fld">분류<select name="category" defaultValue={f?.category ?? FAQ_CATEGORIES[0]}>{FAQ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
      <label className="fld">질문<input name="question" type="text" maxLength={200} defaultValue={f?.question ?? ""} required /></label>
      <label className="fld">답변<textarea name="answer" rows={4} maxLength={3000} defaultValue={f?.answer ?? ""} required /></label>
      <label className="fld">순서 (작을수록 위, 0~9999)<input name="position" type="number" min={0} max={9999} defaultValue={f?.position ?? 0} /></label>
    </>
  );
  return (
    <>
      <h2 style={h2}>FAQ 관리</h2>
      <div style={{ maxWidth: 560, marginTop: 20, padding: 20, background: "#f4f2ee" }}>
        <div style={{ font: "700 13px 'Noto Sans KR',sans-serif" }}>새 질문 추가</div>
        <ActionForm action={saveFaq} submitLabel="추가">{fields()}</ActionForm>
      </div>
      {faqs.map((f) => (
        <div key={f.id} style={{ maxWidth: 560, marginTop: 20, padding: 20, border: "1px solid #e5e5e5" }}>
          <ActionForm action={saveFaq} submitLabel="저장">
            <input type="hidden" name="id" value={f.id} />
            {fields(f)}
          </ActionForm>
          <form action={deleteFaq} style={{ marginTop: 12 }}><input type="hidden" name="id" value={f.id} /><button type="submit" style={{ ...btnLine, color: "#c0392b", borderColor: "#c0392b" }}>이 질문 삭제</button></form>
        </div>
      ))}
    </>
  );
}
