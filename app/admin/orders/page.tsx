import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { STATUS_LABEL, fmtDate, won } from "@/lib/orders";
import { bodyRow, btnDark, chip, h2, headRow, input } from "../styles";

const PER = 20;
const cols = "100px 150px 1.1fr 1.6fr 100px 90px";

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  await requireAdmin("/admin/orders");
  const sp = await searchParams;
  const status = sp.status && STATUS_LABEL[sp.status] ? sp.status : undefined;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { orderNumber: { contains: q, mode: "insensitive" } },
            { ordererName: { contains: q, mode: "insensitive" } },
            { recipientName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER, take: PER }),
    prisma.order.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER));
  const link = (over: Record<string, string | undefined>) => {
    const cur: Record<string, string | undefined> = { status, q, page: String(page), ...over };
    const p = new URLSearchParams();
    Object.entries(cur).forEach(([k, v]) => v && p.set(k, v));
    return `/admin/orders?${p.toString()}`;
  };

  return (
    <>
      <h2 style={h2}>주문 / 배송 관리</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
        <Link href={link({ status: undefined, page: undefined })} style={chip(!status)}>전체</Link>
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <Link key={key} href={link({ status: key, page: undefined })} style={chip(status === key)}>{label}</Link>
        ))}
      </div>
      <form style={{ display: "flex", gap: 8, marginTop: 16, maxWidth: 520 }}>
        {status && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="주문번호, 주문자, 받는 사람 검색" aria-label="주문 검색" style={input} />
        <button type="submit" style={{ ...btnDark, flex: "none" }}>SEARCH</button>
      </form>
      <p style={{ margin: "16px 0 0", fontSize: 13, color: "#767676" }}>총 {total}건</p>
      <div style={{ overflowX: "auto", marginTop: 8 }}>
        <div style={{ minWidth: 860, borderTop: "1px solid #111" }}>
          <div style={headRow(cols)}><span>주문일</span><span>주문번호</span><span>받는 사람</span><span>배송지</span><span>금액</span><span>상태</span></div>
          {orders.length === 0 && <div style={{ padding: "28px 12px", fontSize: 14, color: "#767676" }}>조건에 맞는 주문이 없어요.</div>}
          {orders.map((o) => (
            <div key={o.id} style={bodyRow(cols)}>
              <span style={{ color: "#767676" }}>{fmtDate(o.createdAt)}</span>
              <Link href={`/admin/orders/${o.orderNumber}`} style={{ borderBottom: "1px solid #ccc", width: "fit-content" }}>{o.orderNumber}</Link>
              <span>{o.recipientName}<br /><span style={{ fontSize: 12, color: "#767676" }}>{o.recipientPhone}</span></span>
              <span style={{ fontSize: 13, color: "#444" }}>{o.address}{o.addressDetail ? ` ${o.addressDetail}` : ""}</span>
              <span style={{ fontFamily: "Archivo,sans-serif" }}>{won(o.total)}</span>
              <span style={{ fontWeight: 700 }}>{STATUS_LABEL[o.status] ?? o.status}</span>
            </div>
          ))}
        </div>
      </div>
      {pages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 28, alignItems: "center", fontSize: 13 }}>
          {page > 1 && <Link href={link({ page: String(page - 1) })} style={chip(false)}>이전</Link>}
          <span>{page} / {pages}</span>
          {page < pages && <Link href={link({ page: String(page + 1) })} style={chip(false)}>다음</Link>}
        </div>
      )}
    </>
  );
}
