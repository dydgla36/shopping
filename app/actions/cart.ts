"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { SIZES } from "@/lib/checkout";
import { availableFor } from "@/lib/stock";

const MAX_QTY = 10;
const readSize = (v: FormDataEntryValue | null) => (typeof v === "string" && SIZES.includes(v) ? v : "M");
const readQty = (v: FormDataEntryValue | null) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(v)) || 1));
const toProduct = (id: number, error: string) => redirect(`/product/${id}?error=${encodeURIComponent(error)}`);

// 상품 상세의 ADD TO CART: 로그인한 회원의 장바구니에 담고 장바구니 화면으로 이동합니다.
export async function addToCart(formData: FormData) {
  const id = Number(formData.get("product"));
  if (!Number.isInteger(id)) redirect("/");
  const user = await requireUser(`/product/${id}`); // 로그인하지 않았으면 로그인 후 이 상품 화면으로 돌아옵니다.
  const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!product) redirect("/");

  const size = readSize(formData.get("size"));
  const qty = readQty(formData.get("qty"));
  const available = await availableFor(id, size); // undefined = 재고를 관리하지 않음(무제한)
  if (available === 0) toProduct(id, `${size} 사이즈는 품절이에요.`);

  const cap = Math.min(MAX_QTY, available ?? MAX_QTY);
  const key = { userId_productId_size: { userId: user.id, productId: id, size } };
  const existing = await prisma.cartItem.findUnique({ where: key });
  const wanted = (existing?.quantity ?? 0) + qty;
  const finalQty = Math.min(cap, wanted);
  await prisma.cartItem.upsert({
    where: key,
    create: { userId: user.id, productId: id, size, quantity: finalQty },
    update: { quantity: finalQty },
  });
  // 재고나 한 줄 최대 수량(10개)을 넘으면 가능한 만큼만 담고 안내합니다.
  if (wanted > cap) redirect(`/cart?notice=${encodeURIComponent(`${size} 사이즈는 ${cap}개까지만 담을 수 있어서 ${cap}개로 맞췄어요.`)}`);
  redirect("/cart");
}

// 상품 상세의 BUY NOW: 선택한 사이즈·수량으로 바로 주문/결제 화면으로 이동합니다.
export async function buyNow(formData: FormData) {
  const id = Number(formData.get("product"));
  if (!Number.isInteger(id)) redirect("/");
  const size = readSize(formData.get("size"));
  const qty = readQty(formData.get("qty"));
  const available = await availableFor(id, size);
  if (available === 0) toProduct(id, `${size} 사이즈는 품절이에요.`);
  if (available !== undefined && qty > available) toProduct(id, `${size} 사이즈는 ${available}개만 남았어요. 수량을 줄여 주세요.`);
  redirect(`/checkout?product=${id}&size=${encodeURIComponent(size)}&qty=${qty}`);
}

// 장바구니 화면의 수량 −/+ 버튼
export async function changeCartQty(formData: FormData) {
  const user = await requireUser("/cart");
  const id = Number(formData.get("id"));
  const delta = Number(formData.get("delta")) < 0 ? -1 : 1;
  const item = Number.isInteger(id) ? await prisma.cartItem.findFirst({ where: { id, userId: user.id } }) : null;
  if (item) {
    const available = await availableFor(item.productId, item.size);
    const cap = Math.min(MAX_QTY, available ?? MAX_QTY);
    const next = Math.max(1, Math.min(cap > 0 ? cap : 1, item.quantity + delta));
    if (next !== item.quantity) await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: next } });
  }
  redirect("/cart");
}

// 장바구니 화면의 삭제 버튼
export async function removeFromCart(formData: FormData) {
  const user = await requireUser("/cart");
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) await prisma.cartItem.deleteMany({ where: { id, userId: user.id } });
  redirect("/cart");
}
