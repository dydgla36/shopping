"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import type { ActionState } from "@/components/ActionForm";

import { QNA_CATEGORIES } from "@/lib/qna";

export async function createQuestion(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("/qna/write");
  const category = String(formData.get("category") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!QNA_CATEGORIES.includes(category)) return { error: "문의 유형을 선택해 주세요." };
  if (title.length < 2 || title.length > 100) return { error: "제목은 2자 이상 100자 이하로 입력해 주세요." };
  if (content.length < 5 || content.length > 2000) return { error: "내용은 5자 이상 2000자 이하로 입력해 주세요." };

  let id: number;
  try {
    id = (await prisma.question.create({ data: { userId: user.id, category, title, content, secret: formData.get("secret") === "on" }, select: { id: true } })).id;
  } catch (e) {
    console.error("문의 저장 실패:", e);
    return { error: "저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect(`/qna/${id}`);
}
