"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { notifyOrder } from "@/lib/notify";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const clean = (v: string) => v.replace(/\s/g, "").slice(0, 50);

type Entry = { no: string; carrier: string; tracking: string };

// 결제 완료·배송 준비 중인 주문에 택배사와 운송장 번호를 넣고 "발송 중"으로 바꿉니다. 고객에게는 발송 메일이 갑니다.
async function shipAll(entries: Entry[]) {
  let done = 0;
  const failed: string[] = [];
  const mails: Parameters<typeof notifyOrder>[1][] = [];
  for (const e of entries) {
    const order = await prisma.order.findUnique({ where: { orderNumber: e.no }, include: { items: true } });
    if (!order || !["PAID", "PREPARING"].includes(order.status)) {
      failed.push(e.no);
      continue;
    }
    await prisma.order.update({ where: { id: order.id }, data: { status: "SHIPPING", carrier: e.carrier, trackingNumber: e.tracking } });
    mails.push({ ...order, carrier: e.carrier, trackingNumber: e.tracking });
    done += 1;
  }
  // 메일은 10통씩 나눠 한꺼번에 보냅니다. (주문이 많아도 오래 걸리지 않게)
  for (let i = 0; i < mails.length; i += 10) {
    await Promise.allSettled(mails.slice(i, i + 10).map((m) => notifyOrder("shipping", m)));
  }
  return { done, failed };
}

const back = (done: number, failed: string[]) => redirect(`/admin/shipping?saved=${done}${failed.length ? `&failed=${encodeURIComponent(failed.slice(0, 10).join(", "))}` : ""}`);

// 표에서 운송장 번호를 적은 주문만 저장합니다.
export async function saveShipping(formData: FormData) {
  await requireAdmin("/admin/shipping");
  const fallback = str(formData, "defaultCarrier").slice(0, 30);
  const entries: Entry[] = [];
  for (const no of formData.getAll("no").map(String)) {
    const tracking = clean(str(formData, `tracking:${no}`));
    const carrier = (str(formData, `carrier:${no}`) || fallback).slice(0, 30);
    if (tracking && carrier) entries.push({ no, carrier, tracking });
  }
  const r = await shipAll(entries);
  return back(r.done, r.failed);
}

// 엑셀에서 복사한 "주문번호, 택배사, 운송장번호" 줄들을 한꺼번에 저장합니다. (쉼표 또는 탭으로 구분)
export async function importTracking(formData: FormData) {
  await requireAdmin("/admin/shipping");
  const entries: Entry[] = [];
  const bad: string[] = [];
  for (const line of String(formData.get("lines") ?? "").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const [no, carrier, tracking] = line.split(/[,\t]/).map((x) => x.trim());
    if (no && carrier && tracking) entries.push({ no, carrier: carrier.slice(0, 30), tracking: clean(tracking) });
    else bad.push(line.trim().slice(0, 20));
  }
  const r = await shipAll(entries);
  return back(r.done, [...r.failed, ...bad]);
}
