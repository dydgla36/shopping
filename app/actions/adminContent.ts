"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { isDuplicate } from "@/lib/errors";
import type { ActionState } from "@/components/ActionForm";

// 관리자 전용 동작 모음 (공지, 문의 답변, 후기 삭제). 모든 동작은 맨 처음에 관리자인지 확인합니다.
const num = (f: FormData, k: string) => Number(f.get(k));

export async function saveNotice(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin("/admin/notices");
  const idRaw = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const pinned = formData.get("pinned") === "on";
  if (!title || title.length > 100) return { error: "제목을 100자 이하로 입력해 주세요." };
  if (!content || content.length > 5000) return { error: "내용을 5000자 이하로 입력해 주세요." };
  try {
    if (idRaw) await prisma.notice.update({ where: { id: Number(idRaw) }, data: { title, content, pinned } });
    else await prisma.notice.create({ data: { title, content, pinned } });
  } catch (e) {
    console.error("공지 저장 실패:", e);
    return { error: "저장 중 문제가 생겼어요." };
  }
  redirect("/admin/notices");
}

export async function deleteNotice(formData: FormData) {
  await requireAdmin();
  const id = num(formData, "id");
  if (Number.isInteger(id)) await prisma.notice.deleteMany({ where: { id } });
  redirect("/admin/notices");
}

export async function answerQuestion(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin("/admin/qna");
  const id = num(formData, "id");
  const answer = String(formData.get("answer") ?? "").trim();
  if (!Number.isInteger(id)) return { error: "문의를 찾을 수 없어요." };
  if (!answer) return { error: "답변 내용을 입력해 주세요." };
  if (answer.length > 3000) return { error: "답변은 3000자 이하로 입력해 주세요." };
  await prisma.question.updateMany({ where: { id }, data: { answer, answeredAt: new Date() } });
  return { ok: "답변을 저장했어요. 고객이 문의 화면에서 볼 수 있어요." };
}

export async function deleteQuestion(formData: FormData) {
  await requireAdmin();
  const id = num(formData, "id");
  if (Number.isInteger(id)) await prisma.question.deleteMany({ where: { id } });
  redirect("/admin/qna");
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const id = num(formData, "id");
  if (Number.isInteger(id)) await prisma.review.deleteMany({ where: { id } });
  redirect("/admin/reviews");
}

export async function createCoupon(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin("/admin/coupons");
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const name = String(formData.get("name") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const value = Number(formData.get("value"));
  const minOrder = Number(formData.get("minOrder") || 0);
  const expires = String(formData.get("expiresAt") ?? "").trim();

  if (!/^[A-Z0-9-]{4,20}$/.test(code)) return { error: "쿠폰 번호는 영문 대문자, 숫자, -로 4~20자여야 해요." };
  if (!name || name.length > 50) return { error: "쿠폰 이름을 50자 이하로 입력해 주세요." };
  if (kind !== "PERCENT" && kind !== "AMOUNT") return { error: "할인 방식을 선택해 주세요." };
  if (!Number.isInteger(value) || value < 1 || (kind === "PERCENT" ? value > 100 : value > 10_000_000)) return { error: kind === "PERCENT" ? "할인율은 1~100 사이의 숫자여야 해요." : "할인 금액은 1원 이상의 숫자여야 해요." };
  if (!Number.isInteger(minOrder) || minOrder < 0) return { error: "최소 주문 금액은 0 이상의 숫자여야 해요." };
  // 만료일은 그날 23:59:59(한국 시간)까지 쓸 수 있게 합니다.
  const expiresAt = expires ? new Date(`${expires}T23:59:59+09:00`) : null;
  if (expiresAt && Number.isNaN(expiresAt.getTime())) return { error: "만료일 형식을 확인해 주세요." };
  try {
    await prisma.coupon.create({ data: { code, name, kind, value, minOrder, expiresAt } });
  } catch (e) {
    return { error: isDuplicate(e) ? "이미 있는 쿠폰 번호예요." : "저장 중 문제가 생겼어요." };
  }
  return { ok: `쿠폰을 만들었어요. 고객에게 쿠폰 번호 ${code}를 알려 주세요.` };
}

export async function toggleCoupon(formData: FormData) {
  await requireAdmin();
  const id = num(formData, "id");
  if (Number.isInteger(id)) {
    const c = await prisma.coupon.findUnique({ where: { id }, select: { active: true } });
    if (c) await prisma.coupon.update({ where: { id }, data: { active: !c.active } });
  }
  redirect("/admin/coupons");
}

export async function deleteCoupon(formData: FormData) {
  await requireAdmin();
  const id = num(formData, "id");
  if (Number.isInteger(id)) await prisma.coupon.deleteMany({ where: { id } });
  redirect("/admin/coupons");
}
