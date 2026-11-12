"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { isDuplicate } from "@/lib/errors";
import type { ActionState } from "@/components/ActionForm";

// 관리자가 회원에게 적립금을 지급(+)하거나 차감(−)합니다. 사유는 회원의 적립금 내역에도 보여요.
export async function grantPoints(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const userId = Number(formData.get("userId"));
  const amount = Math.trunc(Number(formData.get("amount")));
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 50);
  if (!Number.isInteger(userId)) return { error: "회원을 찾을 수 없어요." };
  if (!amount || Math.abs(amount) > 1_000_000) return { error: "금액은 0이 아닌 숫자로, 100만원 이하로 입력해 주세요. (차감은 −)" };
  if (!reason) return { error: "사유를 입력해 주세요." };

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { deletedAt: true } });
  if (!user || user.deletedAt) return { error: "회원을 찾을 수 없어요." };
  const balance = (await prisma.pointLog.aggregate({ where: { userId }, _sum: { amount: true } }))._sum.amount ?? 0;
  if (balance + amount < 0) return { error: `차감하면 잔액(${balance.toLocaleString("ko-KR")}원)보다 많아져요.` };
  await prisma.pointLog.create({ data: { userId, amount, reason: `${amount > 0 ? "관리자 지급" : "관리자 차감"}: ${reason}` } });
  redirect(`/admin/members/${userId}?saved=1`);
}

// 관리자가 회원에게 쿠폰을 직접 줍니다.
export async function issueCouponToMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const userId = Number(formData.get("userId"));
  const couponId = Number(formData.get("couponId"));
  if (!Number.isInteger(userId) || !Number.isInteger(couponId)) return { error: "쿠폰을 선택해 주세요." };
  const [user, coupon] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { deletedAt: true } }),
    prisma.coupon.findUnique({ where: { id: couponId }, select: { active: true, expiresAt: true } }),
  ]);
  if (!user || user.deletedAt) return { error: "회원을 찾을 수 없어요." };
  if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date())) return { error: "지급할 수 없는 쿠폰이에요." };
  try {
    await prisma.userCoupon.create({ data: { userId, couponId } });
  } catch (e) {
    return { error: isDuplicate(e) ? "이미 가지고 있는 쿠폰이에요." : "지급 중 문제가 생겼어요." };
  }
  redirect(`/admin/members/${userId}?saved=1`);
}
