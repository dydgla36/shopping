import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import { requireUser } from "@/lib/auth";
import { createQuestion } from "@/app/actions/qna";
import { QNA_CATEGORIES } from "@/lib/qna";
import { crumb, narrow, narrowTitle } from "@/lib/ui";

export const metadata = { title: "문의 작성" };

export default async function Page() {
  await requireUser("/qna/write");
  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/qna" style={{ color: "#767676" }}>Q&amp;A</Link> &gt; WRITE</div>
      <section style={narrow(640)}>
        <h1 style={narrowTitle}>Q&amp;A WRITE</h1>
        <ActionForm action={createQuestion} submitLabel="SUBMIT">
          <label className="fld">문의 유형
            <select name="category" defaultValue={QNA_CATEGORIES[0]}>{QNA_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          </label>
          <label className="fld">제목<input name="title" type="text" maxLength={100} placeholder="제목을 입력하세요" required /></label>
          <label className="fld">내용<textarea name="content" rows={8} maxLength={2000} placeholder="문의 내용을 입력하세요" required /></label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13, color: "#555" }}><input name="secret" type="checkbox" /> 비밀글로 작성 (작성자와 관리자만 볼 수 있어요)</label>
        </ActionForm>
      </section>
    </>
  );
}
