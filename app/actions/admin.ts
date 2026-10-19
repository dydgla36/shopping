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

// 이미지 주소: 비어 있으면 null, http(s) 주소면 그 값, 그 밖의 값이면 false
function cleanImage(v: string): string | null | false {
  if (!v) return null;
  if (v.length > 2000) return false;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : false;
  } catch {
    return false;
  }
}
const cleanColor = (v: string) => (/^#[0-9a-fA-F]{6}$/.test(v) ? v : "#e6e3de");
const IMG_ERR = "이미지 주소는 http:// 또는 https://로 시작하는 올바른 주소여야 해요.";
const DUP = "같은 카테고리에 같은 이름의 상품이 이미 있어요.";
const isDuplicate = (e: unknown) => (e as { code?: string })?.code === "P2002";

export type ProductState = { error?: string } | undefined;

function readProduct(formData: FormData) {
  return {
    category: str(formData, "category"),
    name: str(formData, "name"),
    price: Number(str(formData, "price")),
    positionRaw: str(formData, "position"),
    sale: str(formData, "sale") || null,
    bg: cleanColor(str(formData, "bg")),
    image: cleanImage(str(formData, "imageUrl")),
    description: str(formData, "description").slice(0, 2000) || null,
  };
}

// 상품 입력값 검사. 문제가 있으면 안내 문구를 돌려줍니다.
function checkProduct(d: ReturnType<typeof readProduct>): string | null {
  if (!lists[d.category]) return "카테고리를 선택해 주세요.";
  if (!d.name) return "상품 이름을 입력해 주세요.";
  if (!Number.isInteger(d.price) || d.price < 0) return "가격은 0 이상의 숫자(원 단위)로 입력해 주세요.";
  if (d.image === false) return IMG_ERR;
  return null;
}

export async function createProduct(_prev: ProductState, formData: FormData): Promise<ProductState> {
  await requireAdmin("/admin/products/new");
  const d = readProduct(formData);
  const problem = checkProduct(d);
  if (problem) return { error: problem };

  try {
    let position = Number(d.positionRaw);
    if (!d.positionRaw || !Number.isInteger(position)) {
      // 순서를 비워 두면 그 카테고리의 맨 뒤에 놓습니다.
      const max = await prisma.product.aggregate({ _max: { position: true }, where: { category: d.category } });
      position = (max._max.position ?? -1) + 1;
    }
    await prisma.product.create({
      data: { category: d.category, name: d.name, price: d.price, bg: d.bg, sale: d.sale, position, imageUrl: d.image as string | null, description: d.description },
    });
  } catch (e) {
    console.error("상품 추가 실패:", e);
    return { error: isDuplicate(e) ? DUP : "저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect("/admin/products?saved=1");
}

export async function updateProduct(_prev: ProductState, formData: FormData): Promise<ProductState> {
  await requireAdmin("/admin/products");
  const id = Number(str(formData, "id"));
  if (!Number.isInteger(id)) return { error: "상품을 찾을 수 없어요." };
  const d = readProduct(formData);
  const problem = checkProduct(d);
  if (problem) return { error: problem };

  try {
    const position = Number(d.positionRaw || 0);
    await prisma.product.update({
      where: { id },
      data: { category: d.category, name: d.name, price: d.price, bg: d.bg, sale: d.sale, position: Number.isInteger(position) ? position : 0, imageUrl: d.image as string | null, description: d.description },
    });
  } catch (e) {
    console.error("상품 수정 실패:", e);
    return { error: isDuplicate(e) ? DUP : "저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect("/admin/products?saved=1");
}

const back = (msg?: string): never => redirect(`/admin/products?${msg ? `error=${encodeURIComponent(msg)}` : "saved=1"}`);

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
