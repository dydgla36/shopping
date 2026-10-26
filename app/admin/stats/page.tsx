import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { won } from "@/lib/orders";
import { bodyRow, card, cardLabel, cardValue, chip, h2, headRow } from "../styles";

const DAY = 24 * 3600 * 1000;
const KST = 9 * 3600 * 1000;
const RANGES = [7, 30, 90];
const dayKey = (d: Date) => new Date(d.getTime() + KST).toISOString().slice(0, 10);
const dl = { display: "inline-block", padding: "10px 16px", border: "1px solid #111", background: "#fff", color: "#111", font: "700 12px 'Noto Sans KR',sans-serif" } as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  await requireAdmin("/admin/stats");
  const r = Number((await searchParams).range);
  const range = RANGES.includes(r) ? r : 30;

  // 한국 시간 기준으로 오늘 0시부터 거꾸로 range일
  const today = new Date(Date.now() + KST);
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today.getTime() - KST - (range - 1) * DAY);
  const days = Array.from({ length: range }, (_, i) => dayKey(new Date(start.getTime() + i * DAY)));

  const [orders, items, newMembers] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: start } }, select: { createdAt: true, total: true, status: true, paymentMethod: true, userId: true }, take: 20000 }),
    prisma.orderItem.findMany({ where: { order: { createdAt: { gte: start }, status: { not: "CANCELED" } } }, select: { name: true, quantity: true, price: true }, take: 50000 }),
    prisma.user.count({ where: { role: "USER", createdAt: { gte: start } } }),
  ]);

  // 매출은 취소한 주문을 뺀 결제 금액의 합계입니다.
  const valid = orders.filter((o) => o.status !== "CANCELED");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const canceled = orders.length - valid.length;
  const guests = valid.filter((o) => o.userId === null).length;

  const byDay = new Map<string, { count: number; revenue: number }>();
  for (const o of valid) {
    const k = dayKey(o.createdAt);
    const cur = byDay.get(k) ?? { count: 0, revenue: 0 };
    byDay.set(k, { count: cur.count + 1, revenue: cur.revenue + o.total });
  }
  const maxRev = Math.max(1, ...days.map((d) => byDay.get(d)?.revenue ?? 0));

  const byProduct = new Map<string, { qty: number; revenue: number }>();
  for (const i of items) {
    const cur = byProduct.get(i.name) ?? { qty: 0, revenue: 0 };
    byProduct.set(i.name, { qty: cur.qty + i.quantity, revenue: cur.revenue + i.price * i.quantity });
  }
  const top = [...byProduct.entries()].sort((a, b) => b[1].qty - a[1].qty || b[1].revenue - a[1].revenue).slice(0, 10);

  const byPay = new Map<string, { count: number; revenue: number }>();
  for (const o of valid) {
    const cur = byPay.get(o.paymentMethod) ?? { count: 0, revenue: 0 };
    byPay.set(o.paymentMethod, { count: cur.count + 1, revenue: cur.revenue + o.total });
  }

  return (
    <>
      <h2 style={h2}>통계 · 내보내기</h2>
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        {RANGES.map((n) => <Link key={n} href={`/admin/stats?range=${n}`} style={chip(range === n)}>최근 {n}일</Link>)}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 20 }}>
        <div style={{ ...card, flexBasis: 240 }}><div style={cardLabel}>매출 (취소 제외)</div><div style={cardValue}>{won(revenue)}</div></div>
        <div style={card}><div style={cardLabel}>주문 수 (취소 제외)</div><div style={cardValue}>{valid.length}</div></div>
        <div style={card}><div style={cardLabel}>평균 주문 금액</div><div style={cardValue}>{won(valid.length ? Math.round(revenue / valid.length) : 0)}</div></div>
        <div style={card}><div style={cardLabel}>취소</div><div style={cardValue}>{canceled}건 <span style={{ fontSize: 14, color: "#767676" }}>({orders.length ? Math.round((canceled / orders.length) * 100) : 0}%)</span></div></div>
        <div style={card}><div style={cardLabel}>신규 회원</div><div style={cardValue}>{newMembers}</div></div>
        <div style={card}><div style={cardLabel}>비회원 주문</div><div style={cardValue}>{guests} <span style={{ fontSize: 14, color: "#767676" }}>/ {valid.length}</span></div></div>
      </div>

      <h3 style={{ margin: "40px 0 0", font: "800 16px Archivo,'Noto Sans KR',sans-serif" }}>일별 매출</h3>
      <div role="img" aria-label={`최근 ${range}일 일별 매출 그래프`} style={{ display: "flex", alignItems: "flex-end", gap: range > 30 ? 1 : 3, height: 160, marginTop: 12, borderBottom: "1px solid #111" }}>
        {days.map((d) => {
          const v = byDay.get(d);
          return <div key={d} title={`${d} · ${v?.count ?? 0}건 · ${won(v?.revenue ?? 0)}`} style={{ flex: 1, height: `${Math.round(((v?.revenue ?? 0) / maxRev) * 100)}%`, minHeight: v && v.revenue > 0 ? 2 : 0, background: "#111" }} />;
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#767676" }}>
        <span>{days[0]}</span><span>하루 최대 {won(maxRev === 1 && revenue === 0 ? 0 : maxRev)}</span><span>{days[days.length - 1]}</span>
      </div>
      <details style={{ marginTop: 12 }}>
        <summary style={{ cursor: "pointer", fontSize: 13 }}>일별 표로 보기</summary>
        <div style={{ borderTop: "1px solid #111", marginTop: 8 }}>
          <div style={headRow("1fr 80px 130px")}><span>날짜</span><span>주문</span><span>매출</span></div>
          {[...days].reverse().map((d) => (
            <div key={d} style={bodyRow("1fr 80px 130px")}><span>{d}</span><span>{byDay.get(d)?.count ?? 0}건</span><span style={{ fontFamily: "Archivo,sans-serif" }}>{won(byDay.get(d)?.revenue ?? 0)}</span></div>
          ))}
        </div>
      </details>

      <h3 style={{ margin: "40px 0 0", font: "800 16px Archivo,'Noto Sans KR',sans-serif" }}>많이 팔린 상품 TOP 10</h3>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <div style={{ minWidth: 460, borderTop: "1px solid #111" }}>
          <div style={headRow("40px 1fr 90px 130px")}><span>순위</span><span>상품</span><span>판매 수량</span><span>매출</span></div>
          {top.length === 0 && <div style={{ padding: "24px 12px", fontSize: 14, color: "#767676" }}>이 기간에 팔린 상품이 없어요.</div>}
          {top.map(([name, v], i) => (
            <div key={name} style={bodyRow("40px 1fr 90px 130px")}><span>{i + 1}</span><span>{name}</span><span>{v.qty}개</span><span style={{ fontFamily: "Archivo,sans-serif" }}>{won(v.revenue)}</span></div>
          ))}
        </div>
      </div>

      <h3 style={{ margin: "40px 0 0", font: "800 16px Archivo,'Noto Sans KR',sans-serif" }}>결제 수단별</h3>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <div style={{ minWidth: 360, borderTop: "1px solid #111" }}>
          {byPay.size === 0 && <div style={{ padding: "24px 12px", fontSize: 14, color: "#767676" }}>이 기간에 주문이 없어요.</div>}
          {[...byPay.entries()].sort((a, b) => b[1].revenue - a[1].revenue).map(([name, v]) => (
            <div key={name} style={bodyRow("1fr 80px 130px")}><span>{name}</span><span>{v.count}건</span><span style={{ fontFamily: "Archivo,sans-serif" }}>{won(v.revenue)}</span></div>
          ))}
        </div>
      </div>

      <h3 style={{ margin: "40px 0 0", font: "800 16px Archivo,'Noto Sans KR',sans-serif" }}>엑셀(CSV)로 내려받기</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <a href={`/api/admin/export/orders?range=${range}`} style={dl}>주문 내역 (최근 {range}일)</a>
        <a href="/api/admin/export/orders?range=all" style={dl}>주문 내역 (전체)</a>
        <a href="/api/admin/export/members" style={dl}>회원 목록</a>
        <a href="/api/admin/export/products" style={dl}>상품 목록</a>
        <a href="/api/admin/export/claims" style={dl}>취소·반품·교환</a>
      </div>
      <p style={{ margin: "12px 0 0", fontSize: 12, lineHeight: 1.7, color: "#767676" }}>주문·회원 파일에는 이름, 연락처, 주소 같은 개인정보가 들어 있어요. 내려받은 파일은 안전하게 보관하고, 필요하지 않으면 지워 주세요.</p>
    </>
  );
}
