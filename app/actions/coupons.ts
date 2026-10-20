"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { isDuplicate } from "@/lib/errors";
import type { ActionState } from "@/components/ActionForm";

// 쿠폰 번호 등록
export async function registerCoupon(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("/coupons");
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: "쿠폰 번호를 입력해 주세요." };

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date())) return { error: "사용할 수 없는 쿠폰 번호예요." };
  try {
    await prisma.userCoupon.create({ data: { userId: user.id, couponId: coupon.id } });
  } catch (e) {
    return { error: isDuplicate(e) ? "이미 등록한 쿠폰이에요." : "등록 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  return { ok: `‘${coupon.name}’ 쿠폰을 등록했어요.` };
}
