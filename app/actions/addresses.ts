"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { MAX_ADDRESSES } from "@/lib/orders";
import { formatPhone, phoneOk } from "@/lib/validate";
import type { ActionState } from "@/components/ActionForm";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

// 배송지 추가·수정 (id가 있으면 수정)
export async function saveAddress(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("/addresses");
  const id = Number(str(formData, "id")) || 0;
  const recipientName = str(formData, "recipientName");
  const recipientPhone = formatPhone(str(formData, "recipientPhone"));
  const address = str(formData, "address");
  if (!recipientName) return { error: "수령인을 입력해 주세요." };
  if (!phoneOk(recipientPhone)) return { error: "연락처를 확인해 주세요. (숫자 9~11자리)" };
  if (!address) return { error: "주소를 입력해 주세요. 주소 검색을 눌러 찾을 수 있어요." };
  const data = {
    label: str(formData, "label").slice(0, 20) || null,
    recipientName: recipientName.slice(0, 30),
    recipientPhone,
    postcode: str(formData, "postcode").slice(0, 10) || null,
    address: address.slice(0, 200),
    addressDetail: str(formData, "addressDetail").slice(0, 100) || null,
  };
  const wantDefault = formData.get("isDefault") === "on";

  try {
    await prisma.$transaction(async (tx) => {
      if (id) {
        const mine = await tx.address.findFirst({ where: { id, userId: user.id }, select: { id: true } });
        if (!mine) throw new Error("not-found");
        if (wantDefault) await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
        await tx.address.update({ where: { id }, data: { ...data, ...(wantDefault ? { isDefault: true } : {}) } });
      } else {
        const count = await tx.address.count({ where: { userId: user.id } });
        if (count >= MAX_ADDRESSES) throw new Error("limit");
        const makeDefault = wantDefault || count === 0;
        if (makeDefault) await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
        await tx.address.create({ data: { ...data, userId: user.id, isDefault: makeDefault } });
      }
    });
  } catch (e) {
    if (e instanceof Error && e.message === "limit") return { error: `배송지는 ${MAX_ADDRESSES}개까지 저장할 수 있어요. 안 쓰는 배송지를 지워 주세요.` };
    if (e instanceof Error && e.message === "not-found") return { error: "배송지를 찾을 수 없어요." };
    console.error("배송지 저장 실패:", e);
    return { error: "저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect("/addresses");
}

export async function deleteAddress(formData: FormData) {
  const user = await requireUser("/addresses");
  const id = Number(str(formData, "id"));
  if (Number.isInteger(id)) {
    const gone = await prisma.address.findFirst({ where: { id, userId: user.id }, select: { isDefault: true } });
    await prisma.address.deleteMany({ where: { id, userId: user.id } });
    // 기본 배송지를 지웠다면 가장 최근 배송지를 기본으로 합니다.
    if (gone?.isDefault) {
      const next = await prisma.address.findFirst({ where: { userId: user.id }, orderBy: { id: "desc" }, select: { id: true } });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }
  redirect("/addresses");
}

export async function setDefaultAddress(formData: FormData) {
  const user = await requireUser("/addresses");
  const id = Number(str(formData, "id"));
  if (Number.isInteger(id)) {
    await prisma.$transaction(async (tx) => {
      const mine = await tx.address.findFirst({ where: { id, userId: user.id }, select: { id: true } });
      if (!mine) return;
      await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
      await tx.address.update({ where: { id }, data: { isDefault: true } });
    });
  }
  redirect("/addresses");
}
