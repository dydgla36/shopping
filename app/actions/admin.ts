"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";
import { STATUS_LABEL } from "@/lib/orders";
import { lists } from "@/lib/lists";

// 서버 액션은 누구나 직접 호출할 수 있는 주소이므로, 모든 동작의 맨 처음에 관리자인지 확인합니다.
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const no = str(formData, "orderNumber");
  const status = str(formData, "status");
  const to = `/admin/orders/${encodeURIComponent(no)}`;
  if (!STATUS_LABEL[status]) redirect(`${to}?error=${encodeURIComponent("주문 상태 값이 올바르지 않아요.")}`);
  await prisma.order.updateMany({
    where: { orderNumber: no },
    data: { status, carrier: str(formData, "carrier") || null, trackingNumber: str(formData, "trackingNumber") || null },
  });
  redirect(`${to}?saved=1`);
}

const back = (msg?: string): never => redirect(`/admin/products?${msg ? `error=${encodeURIComponent(msg)}` : "saved=1"}`);
const DUP = "같은 카테고리에 같은 이름의 상품이 이미 있어요.";

export async function addProduct(formData: FormData) {
  await requireAdmin();
  const category = str(formData, "category");
  const name = str(formData, "name");
  const price = Number(str(formData, "price"));
  const position = Number(str(formData, "position") || 0);
  if (!lists[category]) back("카테고리를 선택해 주세요.");
  if (!name) back("상품 이름을 입력해 주세요.");
  if (!Number.isInteger(price) || price < 0) back("가격은 0 이상의 숫자로 입력해 주세요.");
  try {
    await prisma.product.create({ data: { category, name, price, sale: str(formData, "sale") || null, position: Number.isInteger(position) ? position : 0 } });
  } catch {
    back(DUP);
  }
  back();
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(str(formData, "id"));
  const name = str(formData, "name");
  const price = Number(str(formData, "price"));
  const position = Number(str(formData, "position") || 0);
  if (!Number.isInteger(id) || !name) back("상품 이름을 입력해 주세요.");
  if (!Number.isInteger(price) || price < 0) back("가격은 0 이상의 숫자로 입력해 주세요.");
  try {
    await prisma.product.updateMany({ where: { id }, data: { name, price, sale: str(formData, "sale") || null, position: Number.isInteger(position) ? position : 0 } });
  } catch {
    back(DUP);
  }
  back();
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(str(formData, "id"));
  if (Number.isInteger(id)) await prisma.product.deleteMany({ where: { id } });
  back();
}

export type PwState = { error?: string; ok?: boolean } | undefined;

export async function changeAdminPassword(_prev: PwState, formData: FormData): Promise<PwState> {
  const admin = await requireAdmin("/admin/account");
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const user = await prisma.user.findUnique({ where: { id: admin.id } });
  if (!user || !verifyPassword(current, user.passwordHash)) return { error: "현재 비밀번호가 올바르지 않아요." };
  if (next.length < 8 || !/[A-Za-z]/.test(next) || !/[0-9]/.test(next)) return { error: "새 비밀번호는 영문, 숫자를 포함해 8자 이상이어야 해요." };
  if (next !== confirm) return { error: "새 비밀번호 확인이 일치하지 않아요." };
  if (next === current) return { error: "현재 비밀번호와 다른 비밀번호를 입력해 주세요." };
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(next) } });
  return { ok: true };
}
