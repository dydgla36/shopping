"use server";

import { prisma } from "@/lib/db";
import { clientIp, hit } from "@/lib/rateLimit";
import { stockMap } from "@/lib/stock";
import { emailOk } from "@/lib/validate";
import type { ActionState } from "@/components/ActionForm";

// 재입고 알림 신청: 지금 살 수 없는 상품(사이즈)만 신청할 수 있습니다. (로그인하지 않아도 이메일만 있으면 됩니다)
export async function requestRestock(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const productId = Number(formData.get("product"));
  const size = String(formData.get("size") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!Number.isInteger(productId)) return { error: "상품을 찾을 수 없어요." };
  if (!emailOk(email)) return { error: "알림을 받을 이메일을 확인해 주세요." };
  if (!(await hit(`restock:${await clientIp()}`, 10, 60 * 60 * 1000))) return { error: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요." };

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { soldOut: true, sizes: true } });
  if (!product) return { error: "상품을 찾을 수 없어요." };
  if (size && !product.sizes.includes(size)) return { error: "사이즈를 확인해 주세요." };
  const stock = await stockMap(productId);
  const soldOut = size ? product.soldOut || stock[size] === 0 : product.soldOut || product.sizes.every((s) => stock[s] === 0);
  if (!soldOut) return { error: "지금 구매할 수 있는 상품이에요. 상품 화면에서 바로 담아 주세요." };

  await prisma.restockAlert.upsert({
    where: { productId_size_email: { productId, size, email } },
    create: { productId, size, email },
    update: { notifiedAt: null }, // 같은 신청을 다시 하면 새로 기다립니다.
  });
  return { ok: "재입고되면 이메일로 알려드릴게요. 알림은 한 번만 보내드려요." };
}
