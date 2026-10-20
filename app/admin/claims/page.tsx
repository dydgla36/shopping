import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { updateClaim } from "@/app/actions/claims";
import { CLAIM_STATUS, CLAIM_TYPE, fmtDate } from "@/lib/orders";
import { btnDark, chip, h2, input, notice } from "../styles";

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; saved?: string; error?: string }> }) {
  await requireAdmin("/admin/claims");
  const sp = await searchParams;
  const status = sp.status && CLAIM_STATUS[sp.status] ? sp.status : undefined;
  const claims = await prisma.claim.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" }, take: 100, include: { user: { select: { name: true, loginId: true } }, order: { select: { orderNumber: true, status: true } } } });
  return (
    <>
      <h2 style={h2}>취소 · 반품 · 교환 관리</h2>
      <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: "#767676" }}>취소·반품을 <b>완료</b>로 바꾸면 주문이 자동으로 취소 처리되어 재고, 사용한 적립금·쿠폰이 되돌아가고 받은 적립금은 회수돼요. 교환은 자동 처리가 없어요.</p>
      {sp.saved && <div style={notice(true)} role="status">저장했어요.</div>}
      {sp.error && <div style={notice(false)} role="alert">{sp.error}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
        <Link href="/admin/claims" style={chip(!status)}>전체</Link>
        {Object.entries(CLAIM_STATUS).map(([k, v]) => <Link key={k} href={`/admin/claims?status=${k}`} style={chip(status === k)}>{v}</Link>)}
      </div>
      {claims.length === 0 && <div style={{ padding: "40px 0", fontSize: 14, color: "#767676" }}>신청이 없어요.</div>}
      {claims.map((c) => (
        <form key={c.id} action={updateClaim} style={{ marginTop: 20, padding: 20, border: "1px solid #e5e5e5" }}>
          <input type="hidden" name="id" value={c.id} />
          <div style={{ fontSize: 13 }}>
            <b>{CLAIM_TYPE[c.type] ?? c.type}</b> · {c.user.name}({c.user.loginId}) · {fmtDate(c.createdAt)} ·{" "}
            <Link href={`/admin/orders/${c.order.orderNumber}`} style={{ borderBottom: "1px solid #ccc" }}>{c.order.orderNumber}</Link>
          </div>
          <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-line" }}>{c.reason}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, alignItems: "center" }}>
            <select name="status" defaultValue={c.status} aria-label="처리 상태" style={{ ...input, width: 130 }}>
              {Object.entries(CLAIM_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input name="adminNote" defaultValue={c.adminNote ?? ""} placeholder="고객에게 보일 처리 안내 (선택)" maxLength={500} aria-label="처리 안내" style={{ ...input, flex: "1 1 240px", width: "auto" }} />
            <button type="submit" style={btnDark}>SAVE</button>
          </div>
        </form>
      ))}
    </>
  );
}
