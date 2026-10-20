"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { isDuplicate } from "@/lib/errors";
import type { ActionState } from "@/components/ActionForm";

export async function createReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("/review/write");
  const productId = Number(formData.get("product"));
  const rating = Number(formData.get("rating"));
  const content = String(formData.get("content") ?? "").trim();

  if (!Number.isInteger(productId)) return { error: "상품을 선택해 주세요." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "별점을 선택해 주세요." };
  if (content.length < 5) return { error: "후기는 5자 이상 입력해 주세요." };
  if (content.length > 1000) return { error: "후기는 1000자 이하로 입력해 주세요." };

  // 취소하지 않은 주문에서 구매한 상품만 후기를 쓸 수 있습니다.
  const bought = await prisma.orderItem.findFirst({ where: { productId, order: { userId: user.id, status: { not: "CANCELED" } } }, select: { id: true } });
  if (!bought) return { error: "구매한 상품만 후기를 쓸 수 있어요." };
  try {
    await prisma.review.create({ data: { userId: user.id, productId, rating, content } });
  } catch (e) {
    console.error("후기 저장 실패:", e);
    return { error: isDuplicate(e) ? "이미 이 상품의 후기를 썼어요." : "저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect(`/review?product=${productId}`);
}
