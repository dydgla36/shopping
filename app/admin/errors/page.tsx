import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { clearErrors, deleteError } from "@/app/actions/adminContent";
import { emailConfigured } from "@/lib/email";
import { fmtDate } from "@/lib/orders";
import { btnDark, btnLine, h2, input } from "../styles";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin("/admin/errors");
  const q = ((await searchParams).q ?? "").trim();
  const rows = await prisma.errorLog.findMany({
    where: q ? { OR: [{ message: { contains: q, mode: "insensitive" } }, { path: { contains: q, mode: "insensitive" } }, { stack: { contains: q, mode: "insensitive" } }] } : {},
    orderBy: { lastAt: "desc" },
    take: 100,
  });
  const mail = emailConfigured() && Boolean(process.env.ADMIN_EMAIL);
  return (
    <>
      <h2 style={h2}>오류 기록</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: mail ? "#2d6a2d" : "#767676" }}>
        사이트에서 난 오류를 자동으로 모아요. 같은 오류는 한 줄로 합쳐 횟수를 세요. 이메일 알림: {mail ? "켜짐 — 새로운 오류가 나면 ADMIN_EMAIL로 메일이 가요." : "꺼짐 (ADMIN_EMAIL과 이메일 서비스 설정이 필요해요)"}
      </p>
      <form style={{ display: "flex", gap: 8, marginTop: 16, maxWidth: 520 }}>
        <input name="q" defaultValue={q} placeholder="오류 내용, 주소, 고객이 알려준 오류 번호(digest) 검색" aria-label="오류 검색" style={input} />
        <button type="submit" style={{ ...btnDark, flex: "none" }}>SEARCH</button>
      </form>
      {rows.length === 0 && <div style={{ padding: "40px 0", fontSize: 14, color: "#767676" }}>{q ? "조건에 맞는 오류가 없어요." : "기록된 오류가 없어요. 좋은 소식이에요."}</div>}
      {rows.map((r) => (
        <div key={r.id} style={{ marginTop: 16, padding: 16, border: "1px solid #e5e5e5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 12, color: "#767676" }}>
            <span>{r.source === "client" ? "고객 화면" : "서버"} · {r.count}번 · 마지막 {fmtDate(r.lastAt)}</span>
            <form action={deleteError}><input type="hidden" name="id" value={r.id} /><button type="submit" style={{ ...btnLine, padding: "4px 10px" }}>지우기</button></form>
          </div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, wordBreak: "break-word" }}>{r.message}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: "#555" }}>위치: {r.path ?? "-"}</div>
          {r.stack && (
            <details style={{ marginTop: 8 }}>
              <summary style={{ cursor: "pointer", fontSize: 12 }}>자세히 (오류 번호·호출 기록)</summary>
              <pre style={{ margin: "8px 0 0", padding: 12, background: "#f4f2ee", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{r.stack}</pre>
            </details>
          )}
        </div>
      ))}
      {rows.length > 0 && !q && (
        <form action={clearErrors} style={{ marginTop: 24 }}><button type="submit" style={{ ...btnLine, color: "#c0392b", borderColor: "#c0392b" }}>기록 모두 지우기</button></form>
      )}
    </>
  );
}
