"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { digits } from "@/lib/guest";
import { clientIp, hit } from "@/lib/rateLimit";
import type { ActionState } from "@/components/ActionForm";

// 비회원 주문 조회: 주문번호와 주문 시 입력한 휴대전화 번호가 모두 맞아야 합니다.
export async function lookupGuestOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await hit(`lookup:${await clientIp()}`, 10, 10 * 60 * 1000))) return { error: "조회 시도가 너무 많아요. 10분 뒤에 다시 시도해 주세요." };
  const no = String(formData.get("orderNumber") ?? "").trim().toUpperCase();
  const phone = digits(String(formData.get("phone") ?? ""));
  if (!no || phone.length < 9) return { error: "주문번호와 휴대전화 번호를 입력해 주세요." };

  const order = await prisma.order.findUnique({ where: { orderNumber: no }, select: { userId: true, ordererPhone: true, guestToken: true } });
  if (!order || order.userId !== null || !order.guestToken || digits(order.ordererPhone) !== phone) {
    return { error: "일치하는 비회원 주문이 없어요. 회원으로 주문했다면 로그인 후 마이페이지에서 확인해 주세요." };
  }
  redirect(`/guest-order?no=${encodeURIComponent(no)}&t=${order.guestToken}`);
}
