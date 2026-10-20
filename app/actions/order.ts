"use server";

import { redirect } from "next/navigation";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { DISCOUNT, SHIPPING_FEE } from "@/lib/orders";
import { resolveLines } from "@/lib/checkout";
import type { FormState } from "@/app/actions/auth";

class StockError extends Error {}

const PAYMENTS = ["신용카드", "계좌이체", "무통장입금", "카카오페이"];

export async function createOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/checkout");
  const s = (key: string) => String(formData.get(key) ?? "").trim();

  const ordererName = s("ordererName");
  const ordererPhone = s("ordererPhone");
  const ordererEmail = s("ordererEmail");
  const recipientName = s("recipientName");
  const recipientPhone = s("recipientPhone");
  const address = s("address");
  const addressDetail = s("addressDetail");
  const deliveryMemo = s("deliveryMemo");
  const paymentMethod = s("pay");

  if (!ordererName || !ordererPhone || !ordererEmail) return { error: "주문자 정보를 모두 입력해 주세요." };
  if (!recipientName || !recipientPhone || !address) return { error: "배송 정보(수령인, 연락처, 주소)를 입력해 주세요." };
  if (!PAYMENTS.includes(paymentMethod)) return { error: "결제 수단을 선택해 주세요." };
  if (formData.get("agree") !== "on") return { error: "주문 내용 확인 및 결제 동의에 체크해 주세요." };

  // 주문할 상품과 가격은 브라우저가 보낸 값이 아니라 서버(DB)에서 다시 확인합니다.
  const fromCart = s("cart") === "1";
  const lines = await resolveLines({ product: s("productId") || undefined, size: s("size") || undefined, qty: s("qty") || undefined, cart: fromCart, userId: user.id });
  if (!lines) return { error: fromCart ? "장바구니가 비어 있어요." : "주문할 상품을 찾을 수 없어요." };
  const itemsTotal = lines.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = itemsTotal + SHIPPING_FEE - DISCOUNT;
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const orderNumber = `G${ymd}-${randomInt(10000, 100000)}`;

  try {
    await prisma.$transaction(async (tx) => {
      // 재고 확인과 차감을 한 번에 처리합니다. (재고를 관리하는 사이즈만)
      for (const l of lines) {
        if (!l.productId || !l.size) continue;
        const stock = await tx.productStock.findUnique({ where: { productId_size: { productId: l.productId, size: l.size } } });
        if (!stock) continue; // 재고를 따로 관리하지 않는 상품(무제한)
        const done = await tx.productStock.updateMany({ where: { id: stock.id, quantity: { gte: l.quantity } }, data: { quantity: { decrement: l.quantity } } });
        if (done.count === 0) throw new StockError(`'${l.name}' (${l.size}) 재고가 부족해요. 남은 수량: ${stock.quantity}개`);
      }
      await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: "PENDING", // 실제 결제 연동이 없어서 '주문 접수' 상태로 저장합니다.
          paymentMethod,
          itemsTotal,
          shippingFee: SHIPPING_FEE,
          discount: DISCOUNT,
          total,
          ordererName,
          ordererPhone,
          ordererEmail,
          recipientName,
          recipientPhone,
          address,
          addressDetail: addressDetail || null,
          deliveryMemo: deliveryMemo || null,
          items: {
            create: lines.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, color: i.color, size: i.size, productId: i.productId })),
          },
        },
      });
      // 장바구니에서 주문했다면, 주문이 저장되는 것과 함께 장바구니를 비웁니다.
      if (fromCart) await tx.cartItem.deleteMany({ where: { userId: user.id } });
    });
  } catch (e) {
    if (e instanceof StockError) return { error: e.message };
    console.error("주문 저장 실패:", e);
    return { error: "주문 저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect(`/order-complete?no=${orderNumber}`);
}
