"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

// 상품 상세의 관심 상품 버튼: 담겨 있으면 빼고, 없으면 담습니다.
export async function toggleWishlist(formData: FormData) {
  const id = Number(formData.get("product"));
  if (!Number.isInteger(id)) redirect("/");
  const user = await requireUser(`/product/${id}`); // 로그인 후 이 상품 화면으로 돌아옵니다.

  const key = { userId_productId: { userId: user.id, productId: id } };
  const existing = await prisma.wishlistItem.findUnique({ where: key });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
  } else if (await prisma.product.findUnique({ where: { id }, select: { id: true } })) {
    await prisma.wishlistItem.create({ data: { userId: user.id, productId: id } }).catch(() => undefined); // 두 번 눌러도 한 번만 담김
  }
  redirect(`/product/${id}`);
}

// 관심 상품 화면의 삭제 버튼
export async function removeFromWishlist(formData: FormData) {
  const user = await requireUser("/wishlist");
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) await prisma.wishlistItem.deleteMany({ where: { id, userId: user.id } });
  redirect("/wishlist");
}
