import { prisma } from "@/lib/db";

// 회원가입 때 자동으로 받는 쿠폰("가입 시 자동 발급"으로 만든 쿠폰)을 새 회원에게 줍니다. 실패해도 가입에는 영향이 없습니다.
export async function issueSignupCoupons(userId: number) {
  try {
    const coupons = await prisma.coupon.findMany({ where: { autoIssue: "SIGNUP", active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }, select: { id: true } });
    if (coupons.length > 0) await prisma.userCoupon.createMany({ data: coupons.map((c) => ({ userId, couponId: c.id })), skipDuplicates: true });
  } catch (e) {
    console.error("가입 쿠폰 지급 실패:", e);
  }
}
