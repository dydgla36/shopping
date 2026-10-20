import Link from "next/link";
import { notFound } from "next/navigation";
import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { saveNotice } from "@/app/actions/adminContent";
import { h2 } from "../../styles";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  await requireAdmin(`/admin/notices/${raw}`);
  const id = Number(raw);
  if (!Number.isInteger(id)) notFound();
  const n = await prisma.notice.findUnique({ where: { id } });
  if (!n) notFound();
  return (
    <>
      <Link href="/admin/notices" style={{ fontSize: 13, color: "#767676" }}>← 공지 목록</Link>
      <h2 style={{ ...h2, marginTop: 12 }}>공지 수정</h2>
      <div style={{ maxWidth: 560, marginTop: 8 }}>
        <ActionForm action={saveNotice} submitLabel="저장">
          <input type="hidden" name="id" value={n.id} />
          <label className="fld">제목<input name="title" type="text" maxLength={100} defaultValue={n.title} required /></label>
          <label className="fld">내용<textarea name="content" rows={10} maxLength={5000} defaultValue={n.content} required /></label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13 }}><input name="pinned" type="checkbox" defaultChecked={n.pinned} /> 목록 맨 위에 고정</label>
        </ActionForm>
      </div>
    </>
  );
}
