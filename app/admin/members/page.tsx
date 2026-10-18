import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { fmtDate } from "@/lib/orders";
import { bodyRow, btnDark, h2, headRow, input } from "../styles";

const cols = "100px 110px 1.3fr 120px 100px 70px";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin("/admin/members");
  const q = ((await searchParams).q ?? "").trim();
  const where = {
    role: "USER",
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { loginId: { contains: q, mode: "insensitive" as const } }, { email: { contains: q, mode: "insensitive" as const } }] } : {}),
  };
  const [members, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, include: { _count: { select: { orders: true } } } }),
    prisma.user.count({ where }),
  ]);

  return (
    <>
      <h2 style={h2}>회원 관리</h2>
      <form style={{ display: "flex", gap: 8, marginTop: 20, maxWidth: 520 }}>
        <input name="q" defaultValue={q} placeholder="이름, 아이디, 이메일 검색" aria-label="회원 검색" style={input} />
        <button type="submit" style={{ ...btnDark, flex: "none" }}>SEARCH</button>
      </form>
      <p style={{ margin: "16px 0 0", fontSize: 13, color: "#767676" }}>총 {total}명{total > 100 ? " (최근 100명만 표시)" : ""}</p>
      <div style={{ overflowX: "auto", marginTop: 8 }}>
        <div style={{ minWidth: 700, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>이름</span><span>아이디</span><span>이메일</span><span>휴대전화</span><span>가입일</span><span>주문</span></div>
          {members.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>회원이 없어요.</div>}
          {members.map((m) => (
            <div key={m.id} style={bodyRow(cols)}>
              <span>{m.name}</span><span>{m.loginId}</span><span style={{ wordBreak: "break-all" }}>{m.email}</span>
              <span>{m.phone}</span><span style={{ color: "#767676" }}>{fmtDate(m.createdAt)}</span><span>{m._count.orders}건</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
