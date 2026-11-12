"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { isDuplicate } from "@/lib/errors";
import { INTERNAL_IMAGE } from "@/lib/imageRefs";
import { MAX_REVIEW_PHOTOS, PHOTO_REVIEW_POINT, REVIEW_POINT, REVIEW_POINT_MIN_LENGTH, REVIEW_REASON } from "@/lib/orders";
import type { ActionState } from "@/components/ActionForm";

export async function createReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("/review/write");
  const productId = Number(formData.get("product"));
  const rating = Number(formData.get("rating"));
  const content = String(formData.get("content") ?? "").trim();
  const photos = Array.from(new Set(formData.getAll("photos").map((v) => String(v).trim()).filter(Boolean)));

  if (!Number.isInteger(productId)) return { error: "상품을 선택해 주세요." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "별점을 선택해 주세요." };
  if (content.length < 5) return { error: "후기는 5자 이상 입력해 주세요." };
  if (content.length > 1000) return { error: "후기는 1000자 이하로 입력해 주세요." };
  if (photos.length > MAX_REVIEW_PHOTOS || photos.some((u) => !INTERNAL_IMAGE.test(u))) return { error: `사진은 올바른 이미지 ${MAX_REVIEW_PHOTOS}장까지 붙일 수 있어요.` };

  // 취소하지 않은 주문에서 구매한 상품만 후기를 쓸 수 있습니다.
  const bought = await prisma.orderItem.findFirst({ where: { productId, order: { userId: user.id, status: { not: "CANCELED" } } }, select: { id: true } });
  if (!bought) return { error: "구매한 상품만 후기를 쓸 수 있어요." };

  // 적립금: 너무 짧은 후기는 적립하지 않습니다. 상품당 후기는 한 번만 쓸 수 있어서 한 번만 적립됩니다.
  const points = content.length < REVIEW_POINT_MIN_LENGTH ? 0 : photos.length > 0 ? PHOTO_REVIEW_POINT : REVIEW_POINT;
  try {
    await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({ data: { userId: user.id, productId, rating, content, photos }, select: { id: true } });
      if (points > 0) await tx.pointLog.create({ data: { userId: user.id, amount: points, reason: `${REVIEW_REASON} (후기 #${review.id})` } });
    });
  } catch (e) {
    console.error("후기 저장 실패:", e);
    return { error: isDuplicate(e) ? "이미 이 상품의 후기를 썼어요." : "저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect(`/review?product=${productId}${points > 0 ? `&earned=${points}` : ""}`);
}
