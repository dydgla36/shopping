"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";
import { cancelOrderTx } from "@/lib/orderOps";
import { CLAIM_STATUS, CLAIM_TYPE } from "@/lib/orders";
import type { ActionState } from "@/components/ActionForm";

// 배송 준비 전에는 주문 상세에서 사유를 적고 바로 취소합니다(app/actions/cancel.ts).
// 배송 준비 중에는 취소 요청, 배송이 시작된 뒤에는 반품·교환을 신청합니다.
const CANCEL_OK = ["PREPARING"];
const RETURN_OK = ["SHIPPING", "DELIVERED"];

export async function createClaim(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const no = String(formData.get("orderNumber") ?? "");
  const user = await requireUser(`/order-detail?no=${no}`);
  const type = String(formData.get("type") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!CLAIM_TYPE[type]) return { error: "신청 유형을 선택해 주세요." };
  if (reason.length < 5 || reason.length > 500) return { error: "사유를 5자 이상 500자 이하로 입력해 주세요." };

  const order = await prisma.order.findFirst({ where: { orderNumber: no, userId: user.id }, include: { claims: true } });
  if (!order) return { error: "주문을 찾을 수 없어요." };
  if (order.claims.some((c) => c.status === "RECEIVED" || c.status === "PROCESSING")) return { error: "이미 처리 중인 신청이 있어요." };
  if (type === "CANCEL" ? !CANCEL_OK.includes(order.status) : !RETURN_OK.includes(order.status))
    return { error: type === "CANCEL" ? (["PENDING", "PAID"].includes(order.status) ? "배송 준비 전 주문은 '주문 취소'로 바로 취소할 수 있어요." : "배송이 시작된 주문은 취소할 수 없어요. 반품·교환으로 신청해 주세요.") : "배송이 시작된 주문만 반품·교환을 신청할 수 있어요." };

  await prisma.claim.create({ data: { userId: user.id, orderId: order.id, type, reason } });
  redirect("/claims");
}

// 관리자: 신청 처리. 취소·반품이 완료되면 주문을 취소 처리해 재고·적립금·쿠폰을 되돌립니다.
export async function updateClaim(formData: FormData) {
  await requireAdmin("/admin/claims");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim().slice(0, 500) || null;
  if (!Number.isInteger(id) || !CLAIM_STATUS[status]) redirect(`/admin/claims?error=${encodeURIComponent("처리 상태가 올바르지 않아요.")}`);

  await prisma.$transaction(async (tx) => {
    const claim = await tx.claim.findUnique({ where: { id } });
    if (!claim) return;
    await tx.claim.update({ where: { id }, data: { status, adminNote } });
    if (status === "DONE" && claim.status !== "DONE" && (claim.type === "CANCEL" || claim.type === "RETURN")) await cancelOrderTx(tx, claim.orderId, { by: "CUSTOMER", reason: claim.reason });
  });
  redirect("/admin/claims?saved=1");
}
