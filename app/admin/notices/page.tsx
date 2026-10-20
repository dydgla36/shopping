import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { deleteNotice, saveNotice } from "@/app/actions/adminContent";
import { fmtDate } from "@/lib/orders";
import { bodyRow, btnLine, h2, headRow } from "../styles";

const cols = "70px 1fr 100px 130px";

export default async function Page() {
  await requireAdmin("/admin/notices");
  const notices = await prisma.notice.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], take: 100 });
  return (
    <>
      <h2 style={h2}>공지 관리</h2>
      <div style={{ maxWidth: 560, marginTop: 20, padding: 20, background: "#f4f2ee" }}>
        <div style={{ font: "700 13px 'Noto Sans KR',sans-serif" }}>새 공지 쓰기</div>
        <ActionForm action={saveNotice} submitLabel="공지 올리기" resetOnSuccess>
          <label className="fld">제목<input name="title" type="text" maxLength={100} required /></label>
          <label className="fld">내용<textarea name="content" rows={6} maxLength={5000} required /></label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13 }}><input name="pinned" type="checkbox" /> 목록 맨 위에 고정</label>
        </ActionForm>
      </div>
      <div style={{ overflowX: "auto", marginTop: 32 }}>
        <div style={{ minWidth: 560, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>고정</span><span>제목</span><span>작성일</span><span /></div>
          {notices.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>공지가 없어요.</div>}
          {notices.map((n) => (
            <div key={n.id} style={bodyRow(cols)}>
              <span>{n.pinned ? "📌" : "-"}</span>
              <Link href={`/admin/notices/${n.id}`} style={{ borderBottom: "1px solid #ccc", width: "fit-content" }}>{n.title}</Link>
              <span style={{ color: "#767676" }}>{fmtDate(n.createdAt)}</span>
              <span style={{ display: "flex", gap: 6 }}>
                <Link href={`/admin/notices/${n.id}`} style={{ ...btnLine, display: "inline-block" }}>EDIT</Link>
                <form action={deleteNotice}><input type="hidden" name="id" value={n.id} /><button type="submit" style={{ ...btnLine, color: "#c0392b", borderColor: "#c0392b" }}>DEL</button></form>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
