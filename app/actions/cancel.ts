"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { cancelOrderTx } from "@/lib/orderOps";
import { notifyAdminCanceled, notifyOrder } from "@/lib/notify";
import { tokenOk } from "@/lib/guest";
import { clientIp, hit } from "@/lib/rateLimit";
import type { ActionState } from "@/components/ActionForm";

class CancelError extends Error {}

// 배송 준비 전(주문 접수, 결제 완료)에는 주문자가 사유를 적고 바로 취소할 수 있습니다.
// 배송 준비가 시작된 뒤에는 취소 요청(취소·반품·교환 신청)으로 관리자가 처리합니다.
const CANCELABLE = ["PENDING", "PAID"];

const checkReason = (v: string) => (v.length < 5 || v.length > 500 ? "취소 사유를 5자 이상 500자 이하로 입력해 주세요." : null);

// 취소 처리 (재고·쿠폰·적립금을 되돌리고 사유를 기록). 상태를 다시 확인해, 그 사이 배송 준비가 시작됐다면 막습니다.
async function cancelWithReason(orderId: number, reason: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new CancelError("주문을 찾을 수 없어요.");
    if (order.status === "CANCELED") throw new CancelError("이미 취소된 주문이에요.");
    if (!CANCELABLE.includes(order.status)) throw new CancelError("배송 준비가 시작된 주문은 바로 취소할 수 없어요. 아래 '취소 요청'으로 신청해 주세요.");
    await cancelOrderTx(tx, order.id, { by: "CUSTOMER", reason });
    return order;
  });
}

type Canceled = Awaited<ReturnType<typeof cancelWithReason>>;

// 고객에게 취소 확인 메일, 관리자에게 사유와 함께 알림 메일 (이메일 서비스가 없으면 건너뜁니다)
async function announce(order: Canceled, reason: string) {
  await notifyOrder("canceled", {
    orderNumber: order.orderNumber,
    ordererName: order.ordererName,
    ordererEmail: order.ordererEmail,
    total: order.total,
    paymentMethod: order.paymentMethod,
    carrier: order.carrier,
    trackingNumber: order.trackingNumber,
    guestToken: order.guestToken,
    reason,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, size: i.size })),
  });
  await notifyAdminCanceled({ orderNumber: order.orderNumber, ordererName: order.ordererName, total: order.total, reason });
}

async function run(orderId: number, reason: string): Promise<{ order?: Canceled; error?: string }> {
  try {
    return { order: await cancelWithReason(orderId, reason) };
  } catch (e) {
    if (e instanceof CancelError) return { error: e.message };
    console.error("주문 취소 실패:", e);
    return { error: "취소 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
}

// 회원: 마이페이지의 주문 상세에서 취소
export async function cancelMyOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const no = String(formData.get("orderNumber") ?? "");
  const user = await requireUser(`/order-detail?no=${no}`);
  const reason = String(formData.get("reason") ?? "").trim();
  const problem = checkReason(reason);
  if (problem) return { error: problem };

  const mine = await prisma.order.findFirst({ where: { orderNumber: no, userId: user.id }, select: { id: true } });
  if (!mine) return { error: "주문을 찾을 수 없어요." };
  const result = await run(mine.id, reason);
  if (!result.order) return { error: result.error };
  await announce(result.order, reason);
  redirect(`/order-detail?no=${encodeURIComponent(no)}`);
}

// 비회원: 주문 완료 화면·메일의 링크(전체 정보를 볼 수 있는 토큰)로 연 주문 화면에서 취소
export async function cancelGuestOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const no = String(formData.get("orderNumber") ?? "");
  const token = String(formData.get("token") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const problem = checkReason(reason);
  if (problem) return { error: problem };
  if (!(await hit(`guest-cancel:${await clientIp()}`, 10, 60 * 60 * 1000))) return { error: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요." };

  const order = await prisma.order.findUnique({ where: { orderNumber: no }, select: { id: true, userId: true, guestToken: true } });
  if (!order || order.userId !== null || !tokenOk(order.guestToken, token)) return { error: "주문을 찾을 수 없어요." };
  const result = await run(order.id, reason);
  if (!result.order) return { error: result.error };
  await announce(result.order, reason);
  redirect(`/guest-order?no=${encodeURIComponent(no)}&t=${token}`);
}
