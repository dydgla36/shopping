"use server";

import { redirect } from "next/navigation";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { DISCOUNT, SHIPPING_FEE } from "@/lib/orders";
import { resolveLines } from "@/lib/checkout";
import type { FormState } from "@/app/actions/auth";

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
  const lines = await resolveLines({ product: s("productId") || undefined, size: s("size") || undefined, qty: s("qty") || undefined });
  if (!lines) return { error: "주문할 상품을 찾을 수 없어요." };
  const itemsTotal = lines.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = itemsTotal + SHIPPING_FEE - DISCOUNT;
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const orderNumber = `G${ymd}-${randomInt(10000, 100000)}`;

  try {
    await prisma.order.create({
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
  } catch (e) {
    console.error("주문 저장 실패:", e);
    return { error: "주문 저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect(`/order-complete?no=${orderNumber}`);
}
