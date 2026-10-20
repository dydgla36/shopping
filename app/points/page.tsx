import Link from "next/link";
import Pager from "@/components/Pager";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { POINT_RATE, fmtDate } from "@/lib/orders";
import { bodyRow, box, crumb, h1, headRow, pageWrap, subtitle } from "@/lib/ui";

export const metadata = { title: "적립금" };
const PER = 20;
const cols = "110px 1fr 120px";
const n = (v: number) => v.toLocaleString("ko-KR");

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireUser("/points");
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [logs, count, sum, earned, used] = await Promise.all([
    prisma.pointLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER }),
    prisma.pointLog.count({ where: { userId: user.id } }),
    prisma.pointLog.aggregate({ where: { userId: user.id }, _sum: { amount: true } }),
    prisma.pointLog.aggregate({ where: { userId: user.id, amount: { gt: 0 } }, _sum: { amount: true } }),
    prisma.pointLog.aggregate({ where: { userId: user.id, amount: { lt: 0 } }, _sum: { amount: true } }),
  ]);
  const stat = (label: string, value: number) => (
    <div style={{ flex: 1, minWidth: 140 }}><div style={{ fontSize: 12, color: "#767676" }}>{label}</div><div style={{ marginTop: 6, font: "800 22px Archivo,sans-serif" }}>{n(value)}원</div></div>
  );
  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/mypage" style={{ color: "#767676" }}>MY PAGE</Link> &gt; 적립금</div>
      <section style={pageWrap}>
        <h1 style={{ ...h1, fontSize: 30 }}>POINTS</h1>
        <p style={subtitle}>배송이 완료되면 결제 금액의 {Math.round(POINT_RATE * 100)}%가 적립돼요. 적립금은 주문/결제에서 사용할 수 있어요.</p>
        <div style={{ ...box, display: "flex", flexWrap: "wrap", gap: 24, marginTop: 28 }}>
          {stat("사용 가능 적립금", sum._sum.amount ?? 0)}
          {stat("총 적립", earned._sum.amount ?? 0)}
          {stat("총 사용·회수", Math.abs(used._sum.amount ?? 0))}
        </div>
        <div style={{ overflowX: "auto", marginTop: 32 }}>
          <div style={{ minWidth: 520, borderTop: "1px solid #111" }}>
            <div style={headRow(cols)}><span>일자</span><span>내용</span><span>적립 / 사용</span></div>
            {logs.length === 0 && <div style={{ padding: "40px 12px", fontSize: 14, color: "#767676" }}>적립금 내역이 없어요.</div>}
            {logs.map((l) => (
              <div key={l.id} style={bodyRow(cols)}>
                <span style={{ color: "#767676" }}>{fmtDate(l.createdAt)}</span>
                <span>{l.reason}</span>
                <span style={{ fontFamily: "Archivo,sans-serif", fontWeight: 700, color: l.amount > 0 ? "#2d6a2d" : "#c0392b" }}>{l.amount > 0 ? "+" : "−"} {n(Math.abs(l.amount))}</span>
              </div>
            ))}
          </div>
        </div>
        <Pager page={page} pages={Math.ceil(count / PER)} base="/points" />
      </section>
    </>
  );
}
