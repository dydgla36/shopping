import type { Prisma } from "@prisma/client";
import { EARN_REASON, POINT_RATE } from "@/lib/orders";

type Tx = Prisma.TransactionClient;

// 주문 취소: 재고를 되돌리고, 사용한 적립금·쿠폰을 돌려주고, 이미 받은 적립금은 회수합니다.
// meta에는 누가(고객/관리자) 왜 취소했는지를 적어 두어, 관리자와 고객이 주문 상세에서 볼 수 있게 합니다.
// (비회원 주문은 적립금·쿠폰이 없습니다.)
export async function cancelOrderTx(tx: Tx, orderId: number, meta?: { by: "CUSTOMER" | "ADMIN"; reason?: string }) {
  const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order || order.status === "CANCELED") return;

  for (const it of order.items) {
    if (!it.productId || !it.size) continue; // 재고를 관리하는 사이즈만 되돌립니다.
    await tx.productStock.updateMany({ where: { productId: it.productId, size: it.size }, data: { quantity: { increment: it.quantity } } });
  }
  const userId = order.userId;
  if (userId !== null) {
    if (order.pointsUsed > 0) {
      await tx.pointLog.create({ data: { userId, amount: order.pointsUsed, reason: `주문 취소 적립금 환불 (${order.orderNumber})`, orderId } });
    }
    if (order.userCouponId) {
      await tx.userCoupon.updateMany({ where: { id: order.userCouponId, usedAt: { not: null } }, data: { usedAt: null, orderId: null } });
    }
    const earned = await tx.pointLog.aggregate({ where: { orderId, userId, reason: { startsWith: EARN_REASON } }, _sum: { amount: true } });
    const amount = earned._sum.amount ?? 0;
    if (amount > 0) {
      await tx.pointLog.create({ data: { userId, amount: -amount, reason: `주문 취소 적립금 회수 (${order.orderNumber})`, orderId } });
    }
  }
  await tx.order.update({ where: { id: orderId }, data: { status: "CANCELED", canceledAt: new Date(), canceledBy: meta?.by ?? null, cancelReason: meta?.reason ?? null } });
}

// 배송 완료 시 적립금 지급 (회원 주문만, 주문당 한 번만)
export async function earnPointsTx(tx: Tx, order: { id: number; userId: number | null; orderNumber: string; total: number; shippingFee: number }) {
  if (order.userId === null) return;
  const amount = Math.floor((order.total - order.shippingFee) * POINT_RATE);
  if (amount <= 0) return;
  const exists = await tx.pointLog.findFirst({ where: { orderId: order.id, reason: { startsWith: EARN_REASON } }, select: { id: true } });
  if (exists) return;
  await tx.pointLog.create({ data: { userId: order.userId, amount, reason: `${EARN_REASON} (${order.orderNumber})`, orderId: order.id } });
}
