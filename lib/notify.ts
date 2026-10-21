import { emailConfigured, sendEmail, siteBase } from "@/lib/email";
import { won } from "@/lib/orders";

const esc = (v: string) => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

export type NotifyOrder = {
  orderNumber: string;
  ordererName: string;
  ordererEmail: string;
  total: number;
  paymentMethod: string;
  carrier: string | null;
  trackingNumber: string | null;
  guestToken: string | null;
  items: { name: string; quantity: number; size: string | null }[];
};
type Kind = "placed" | "shipping" | "delivered" | "canceled";

const TEXT: Record<Kind, { subject: string; intro: string }> = {
  placed: { subject: "주문이 접수되었어요", intro: "주문이 접수되었어요." },
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
    const tracking = kind === "shipping" && (o.carrier || o.trackingNumber) ? `<p>택배사: ${esc(o.carrier ?? "-")}<br>운송장 번호: ${esc(o.trackingNumber ?? "-")}</p>` : "";
    const html = `<p>${esc(o.ordererName)}님, ${TEXT[kind].intro}</p><p>주문번호: <b>${esc(o.orderNumber)}</b><br>결제 금액: ${won(o.total)} (${esc(o.paymentMethod)})</p><ul>${list}</ul>${tracking}<p><a href="${link}">주문 내역 보기</a></p>`;
    await sendEmail(o.ordererEmail, `[GABBY] ${TEXT[kind].subject} (${o.orderNumber})`, html);

    // 새 주문은 관리자에게도 알립니다. (환경 변수 ADMIN_EMAIL이 있을 때)
    if (kind === "placed" && process.env.ADMIN_EMAIL) {
      await sendEmail(process.env.ADMIN_EMAIL, `[GABBY] 새 주문이 들어왔어요 (${o.orderNumber})`, `<p>${esc(o.ordererName)}님이 ${won(o.total)}을 주문했어요.</p><ul>${list}</ul><p><a href="${base}/admin/orders/${no}">관리자에서 보기</a></p>`);
    }
  } catch (e) {
    console.error("주문 알림 메일 실패:", e);
  }
}
