"use server";

import { redirect } from "next/navigation";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/db";
import { formatPhone, phoneOk } from "@/lib/validate";
import { getCurrentUser } from "@/lib/auth";
import { SHIPPING_FEE } from "@/lib/orders";
import { resolveLines } from "@/lib/checkout";
import { couponDiscount, couponUsable } from "@/lib/coupons";
import { newGuestToken } from "@/lib/guest";
import { notifyOrder } from "@/lib/notify";
import { clientIp, hit } from "@/lib/rateLimit";
import type { FormState } from "@/app/actions/auth";

class CheckoutError extends Error {}

const PAYMENTS = ["신용카드", "계좌이체", "무통장입금", "카카오페이"];

export async function createOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser(); // 로그인하지 않았다면 비회원 주문입니다.
  const s = (key: string) => String(formData.get(key) ?? "").trim();

  const ordererName = s("ordererName");
  const ordererPhone = formatPhone(s("ordererPhone"));
  const ordererEmail = s("ordererEmail");
  const recipientName = s("recipientName");
  const recipientPhone = formatPhone(s("recipientPhone"));
  const postcode = s("postcode").slice(0, 10);
  const address = s("address");
  const addressDetail = s("addressDetail");
  const deliveryMemo = s("deliveryMemo");
  const paymentMethod = s("pay");

  if (!ordererName || !ordererPhone || !ordererEmail) return { error: "주문자 정보를 모두 입력해 주세요." };
  if (!phoneOk(ordererPhone) || !phoneOk(recipientPhone)) return { error: "휴대전화·연락처 번호를 확인해 주세요. (숫자 9~11자리)" };
  if (!recipientName || !recipientPhone || !address) return { error: "배송 정보(수령인, 연락처, 주소)를 입력해 주세요." };
  if (!PAYMENTS.includes(paymentMethod)) return { error: "결제 수단을 선택해 주세요." };
  if (formData.get("agree") !== "on") return { error: "주문 내용 확인 및 결제 동의에 체크해 주세요." };

  // 비회원은 상품 상세의 BUY NOW 주문만 할 수 있고(장바구니는 로그인 필요), 짧은 시간에 너무 많이 주문할 수 없습니다.
  const fromCart = s("cart") === "1";
  if (!user) {
    if (fromCart || !s("productId")) return { error: "장바구니 주문은 로그인이 필요해요." };
    if (!(await hit(`guest-order:${await clientIp()}`, 10, 60 * 60 * 1000))) return { error: "주문 요청이 너무 많아요. 잠시 후 다시 시도해 주세요." };
  }

  // 주문할 상품과 가격은 브라우저가 보낸 값이 아니라 서버(DB)에서 다시 확인합니다.
  const lines = await resolveLines({ product: s("productId") || undefined, size: s("size") || undefined, qty: s("qty") || undefined, color: s("color") || undefined, cart: fromCart, userId: user?.id });
  if (!lines) return { error: fromCart ? "장바구니가 비어 있어요." : "주문할 상품을 찾을 수 없어요." };
  const itemsTotal = lines.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const userCouponId = user ? Number(s("userCouponId")) || 0 : 0; // 쿠폰·적립금은 회원만
  const wantPoints = user ? Math.max(0, Math.floor(Number(s("points"))) || 0) : 0;

  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const orderNumber = `G${ymd}-${randomInt(10000, 100000)}`;
  const guestToken = user ? null : newGuestToken();

  let total: number;
  try {
    total = await prisma.$transaction(async (tx) => {
      // 1) 재고 확인과 차감 (재고를 관리하는 사이즈만)
      for (const l of lines) {
        if (!l.productId) continue;
        const prod = await tx.product.findUnique({ where: { id: l.productId }, select: { soldOut: true } });
        if (prod?.soldOut) throw new CheckoutError(`'${l.name}' 상품은 품절이에요.`);
        if (!l.size) continue;
        const stock = await tx.productStock.findUnique({ where: { productId_size: { productId: l.productId, size: l.size } } });
        if (!stock) continue; // 재고를 따로 관리하지 않는 상품(무제한)
        const done = await tx.productStock.updateMany({ where: { id: stock.id, quantity: { gte: l.quantity } }, data: { quantity: { decrement: l.quantity } } });
        if (done.count === 0) throw new CheckoutError(`'${l.name}' (${l.size}) 재고가 부족해요. 남은 수량: ${stock.quantity}개`);
      }

      // 2) 쿠폰: 내 것이고 아직 안 썼고 조건에 맞아야 합니다.
      let couponOff = 0;
      if (user && userCouponId) {
        const uc = await tx.userCoupon.findFirst({ where: { id: userCouponId, userId: user.id, usedAt: null }, include: { coupon: true } });
        if (!uc || !couponUsable(uc.coupon, itemsTotal)) throw new CheckoutError("사용할 수 없는 쿠폰이에요. 쿠폰을 다시 선택해 주세요.");
        const marked = await tx.userCoupon.updateMany({ where: { id: uc.id, usedAt: null }, data: { usedAt: new Date() } });
        if (marked.count === 0) throw new CheckoutError("이미 사용한 쿠폰이에요.");
        couponOff = couponDiscount(uc.coupon, itemsTotal);
      }

      // 3) 적립금: 잔액과 (쿠폰을 뺀) 결제 금액을 넘길 수 없습니다.
      let pointsUsed = 0;
      if (user && wantPoints > 0) {
        const bal = (await tx.pointLog.aggregate({ where: { userId: user.id }, _sum: { amount: true } }))._sum.amount ?? 0;
        const max = Math.max(0, Math.min(bal, itemsTotal - couponOff));
        if (wantPoints > max) throw new CheckoutError(`사용할 수 있는 적립금은 최대 ${max.toLocaleString("ko-KR")}원이에요.`);
        pointsUsed = wantPoints;
      }

      const discount = couponOff + pointsUsed;
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id ?? null,
          guestToken,
          status: "PENDING", // 실제 결제 연동이 없어서 '주문 접수' 상태로 저장합니다.
          paymentMethod,
          itemsTotal,
          shippingFee: SHIPPING_FEE,
          discount,
          pointsUsed,
          userCouponId: userCouponId || null,
          total: itemsTotal + SHIPPING_FEE - discount,
          ordererName,
          ordererPhone,
          ordererEmail,
          recipientName,
          recipientPhone,
          postcode: postcode || null,
          address,
          addressDetail: addressDetail || null,
          deliveryMemo: deliveryMemo || null,
          items: {
            create: lines.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, color: i.color, size: i.size, productId: i.productId })),
          },
        },
      });
      if (user && pointsUsed > 0) await tx.pointLog.create({ data: { userId: user.id, amount: -pointsUsed, reason: `주문 적립금 사용 (${orderNumber})`, orderId: order.id } });
      if (user && userCouponId) await tx.userCoupon.update({ where: { id: userCouponId }, data: { orderId: order.id } });
      // 장바구니에서 주문했다면, 주문이 저장되는 것과 함께 장바구니를 비웁니다.
      if (user && fromCart) await tx.cartItem.deleteMany({ where: { userId: user.id } });
      return order.total;
    });
  } catch (e) {
    if (e instanceof CheckoutError) return { error: e.message };
    console.error("주문 저장 실패:", e);
    return { error: "주문 저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }

  // 주문 접수 알림 메일 (이메일 서비스가 설정되어 있을 때만, 실패해도 주문은 그대로 유지)
  await notifyOrder("placed", {
    orderNumber, ordererName, ordererEmail, total, paymentMethod, carrier: null, trackingNumber: null, guestToken,
    items: lines.map((i) => ({ name: i.name, quantity: i.quantity, size: i.size })),
  });
  redirect(user ? `/order-complete?no=${orderNumber}` : `/order-complete?no=${orderNumber}&t=${guestToken}`);
}
