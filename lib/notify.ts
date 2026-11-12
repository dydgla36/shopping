import { emailConfigured, sendEmail, siteBase } from "@/lib/email";
import { esc } from "@/lib/html";
import { trackingUrl } from "@/lib/carriers";
import { fmtDateTime, won } from "@/lib/orders";


export type NotifyOrder = {
  orderNumber: string;
  ordererName: string;
  ordererEmail: string;
  total: number;
  paymentMethod: string;
  carrier: string | null;
  trackingNumber: string | null;
  guestToken: string | null;
  reason?: string | null; // 취소 사유
  deposit?: { bank: string; account: string; holder: string; depositor: string; deadline: Date } | null; // 무통장입금 안내
  items: { name: string; quantity: number; size: string | null }[];
};
type Kind = "placed" | "paid" | "shipping" | "delivered" | "canceled";

const TEXT: Record<Kind, { subject: string; intro: string }> = {
  placed: { subject: "주문이 접수되었어요", intro: "주문이 접수되었어요." },
  paid: { subject: "입금이 확인되었어요", intro: "입금이 확인되어 주문이 결제 완료 처리되었어요. 곧 상품을 준비해 발송할게요." },
  shipping: { subject: "상품이 발송되었어요", intro: "주문하신 상품이 발송되었어요." },
  delivered: { subject: "배송이 완료되었어요", intro: "주문하신 상품의 배송이 완료되었어요." },
  canceled: { subject: "주문이 취소되었어요", intro: "주문이 취소되었어요." },
};

// 고객에게 주문 알림 메일을 보냅니다. 이메일 서비스가 설정되어 있지 않거나 실패해도 주문 처리는 멈추지 않습니다.
export async function notifyOrder(kind: Kind, o: NotifyOrder) {
  if (!emailConfigured()) return;
  try {
    const base = await siteBase();
    const no = encodeURIComponent(o.orderNumber);
    const link = o.guestToken ? `${base}/guest-order?no=${no}&t=${o.guestToken}` : `${base}/order-detail?no=${no}`;
    const list = o.items.map((i) => `<li>${esc(i.name)}${i.size ? ` (${esc(i.size)})` : ""} × ${i.quantity}</li>`).join("");
    const tracking = kind === "shipping" && (o.carrier || o.trackingNumber) ? `<p>택배사: ${esc(o.carrier ?? "-")}<br>운송장 번호: ${esc(o.trackingNumber ?? "-")}${trackingUrl(o.carrier, o.trackingNumber) ? `<br><a href="${trackingUrl(o.carrier, o.trackingNumber)}">배송 추적하기</a>` : ""}</p>` : "";
    const reason = kind === "canceled" && o.reason ? `<p>취소 사유: ${esc(o.reason)}</p>` : "";
    const deposit = kind === "placed" && o.deposit ? `<p style="padding:12px;border:1px solid #111">입금 계좌: ${esc(o.deposit.bank)} <b>${esc(o.deposit.account)}</b> (예금주 ${esc(o.deposit.holder)})<br>입금 금액: <b>${won(o.total)}</b> · 입금자명: ${esc(o.deposit.depositor)}<br>입금 기한: <b>${fmtDateTime(o.deposit.deadline)}</b> (기한 안에 입금이 없으면 주문이 자동 취소돼요)</p>` : "";
    const html = `<p>${esc(o.ordererName)}님, ${TEXT[kind].intro}</p>${reason}${deposit}<p>주문번호: <b>${esc(o.orderNumber)}</b><br>결제 금액: ${won(o.total)} (${esc(o.paymentMethod)})</p><ul>${list}</ul>${tracking}<p><a href="${link}">주문 내역 보기</a></p>`;
    await sendEmail(o.ordererEmail, `[GABBY] ${TEXT[kind].subject} (${o.orderNumber})`, html);

    // 새 주문은 관리자에게도 알립니다. (환경 변수 ADMIN_EMAIL이 있을 때)
    if (kind === "placed" && process.env.ADMIN_EMAIL) {
      await sendEmail(process.env.ADMIN_EMAIL, `[GABBY] 새 주문이 들어왔어요 (${o.orderNumber})`, `<p>${esc(o.ordererName)}님이 ${won(o.total)}을 주문했어요.</p><ul>${list}</ul><p><a href="${base}/admin/orders/${no}">관리자에서 보기</a></p>`);
    }
  } catch (e) {
    console.error("주문 알림 메일 실패:", e);
  }
}

// 고객이 주문을 취소하면 관리자에게 사유와 함께 알립니다. (환경 변수 ADMIN_EMAIL이 있을 때)
export async function notifyAdminCanceled(o: { orderNumber: string; ordererName: string; total: number; reason: string }) {
  if (!emailConfigured() || !process.env.ADMIN_EMAIL) return;
  try {
    const base = await siteBase();
    await sendEmail(
      process.env.ADMIN_EMAIL,
      `[GABBY] 고객이 주문을 취소했어요 (${o.orderNumber})`,
      `<p>${esc(o.ordererName)}님이 주문을 취소했어요. (${won(o.total)})</p><p>취소 사유: ${esc(o.reason)}</p><p><a href="${base}/admin/orders/${encodeURIComponent(o.orderNumber)}">관리자에서 보기</a></p>`,
    );
  } catch (e) {
    console.error("관리자 취소 알림 메일 실패:", e);
  }
}
