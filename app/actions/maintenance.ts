"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { internalImageIds } from "@/lib/imageRefs";
import { detailImages } from "@/lib/productContent";
import type { ActionState } from "@/components/ActionForm";

const DAY = 24 * 3600 * 1000;

// 관리자 전용 DB 정리: 쓸모가 없어진 기록과 사용하지 않는 이미지를 지워서 DB 공간을 아낍니다.
// - 만료된 로그인 기록, 이미 쓰거나 만료된 비밀번호 재설정 링크, 하루 지난 횟수 제한 기록
// - 알림을 보낸 지 30일이 지난 재입고 알림 신청, 60일이 지난 오류 기록
// - 상품·후기·메인 화면 어디에서도 쓰지 않는 이미지 (올리고 저장하지 않은 것). 방금 올린 이미지를 지우지 않도록 하루가 지난 것만 지웁니다.
export async function cleanupDb(): Promise<ActionState> {
  await requireAdmin("/admin/setup");
  const now = new Date();
  try {
    const [sessions, resets, limits, alerts, errors] = await Promise.all([
      prisma.session.deleteMany({ where: { expiresAt: { lt: now } } }),
      prisma.passwordReset.deleteMany({ where: { OR: [{ expiresAt: { lt: now } }, { usedAt: { not: null } }] } }),
      prisma.rateLimit.deleteMany({ where: { windowStart: { lt: new Date(Date.now() - DAY) }, OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }] } }),
      prisma.restockAlert.deleteMany({ where: { notifiedAt: { lt: new Date(Date.now() - 30 * DAY) } } }),
      prisma.errorLog.deleteMany({ where: { lastAt: { lt: new Date(Date.now() - 60 * DAY) } } }),
    ]);

    // 쓰는 이미지 목록: 상품 대표·추가·상세 이미지, 후기 사진, 메인 화면 배경(HERO_IMAGE_URL)
    const [images, products, reviews] = await Promise.all([
      prisma.productImage.findMany({ where: { createdAt: { lt: new Date(Date.now() - DAY) } }, select: { id: true, size: true } }),
      prisma.product.findMany({ select: { imageUrl: true, extraImages: true, detailContent: true } }),
      prisma.review.findMany({ select: { photos: true } }),
    ]);
    const used = new Set(
      internalImageIds([
        ...products.flatMap((p) => [p.imageUrl, ...p.extraImages, ...detailImages(p.detailContent)]),
        ...reviews.flatMap((r) => r.photos),
        process.env.HERO_IMAGE_URL,
      ]),
    );
    const orphans = images.filter((i) => !used.has(i.id));
    for (let i = 0; i < orphans.length; i += 100) {
      await prisma.productImage.deleteMany({ where: { id: { in: orphans.slice(i, i + 100).map((o) => o.id) } } });
    }
    const mb = orphans.reduce((s, o) => s + o.size, 0) / 1024 / 1024;
    return {
      ok: `정리했어요. 만료된 로그인 ${sessions.count}건, 재설정 링크 ${resets.count}건, 횟수 제한 기록 ${limits.count}건, 오래된 재입고 알림 ${alerts.count}건, 오래된 오류 기록 ${errors.count}건, 사용하지 않는 이미지 ${orphans.length}장(약 ${mb.toFixed(1)}MB)을 지웠어요.`,
    };
  } catch (e) {
    console.error("DB 정리 실패:", e);
    return { error: "정리 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
}
