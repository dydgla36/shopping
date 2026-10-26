"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";
import { SIZES } from "@/lib/checkout";
import { STATUS_LABEL } from "@/lib/orders";
import { lists } from "@/lib/lists";
import { SUB_CATEGORIES } from "@/lib/categories";
import { isDuplicate } from "@/lib/errors";
import { MAX_COLORS, serializeColor } from "@/lib/colors";
import { cancelOrderTx, earnPointsTx } from "@/lib/orderOps";
import { notifyOrder } from "@/lib/notify";

// 서버 액션은 누구나 직접 호출할 수 있는 주소이므로, 모든 동작의 맨 처음에 관리자인지 확인합니다.
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const no = str(formData, "orderNumber");
  const status = str(formData, "status");
  const to = `/admin/orders/${encodeURIComponent(no)}`;
  const fail = (msg: string): never => redirect(`${to}?error=${encodeURIComponent(msg)}`);
  if (!STATUS_LABEL[status]) fail("주문 상태 값이 올바르지 않아요.");

  const order = await prisma.order.findUnique({ where: { orderNumber: no }, include: { items: true } });
  if (!order) fail("주문을 찾을 수 없어요.");
  if (order!.status === "CANCELED" && status !== "CANCELED") fail("취소된 주문은 상태를 되돌릴 수 없어요.");

  await prisma.$transaction(async (tx) => {
    // 취소: 재고, 적립금, 쿠폰을 되돌립니다.
    if (status === "CANCELED" && order!.status !== "CANCELED") await cancelOrderTx(tx, order!.id, { by: "ADMIN" });
    await tx.order.update({
      where: { orderNumber: no },
      data: {
        status,
        carrier: str(formData, "carrier").slice(0, 30) || null,
        trackingNumber: str(formData, "trackingNumber").slice(0, 50) || null,
        adminMemo: str(formData, "adminMemo").slice(0, 500) || null, // 고객이 주문 상세에서 볼 수 있는 메모
      },
    });
    // 배송 완료: 적립금 지급
    if (status === "DELIVERED" && order!.status !== "DELIVERED") await earnPointsTx(tx, order!);
  });
  // 고객에게 이메일 알림 (이메일 서비스가 설정되어 있을 때만): 발송 시작, 배송 완료, 취소
  const carrier = str(formData, "carrier").slice(0, 30) || null;
  const trackingNumber = str(formData, "trackingNumber").slice(0, 50) || null;
  const o = order!;
  const kind =
    status === "CANCELED" && o.status !== "CANCELED" ? "canceled"
    : status === "DELIVERED" && o.status !== "DELIVERED" ? "delivered"
    : status === "SHIPPING" && (o.status !== "SHIPPING" || (trackingNumber && trackingNumber !== o.trackingNumber)) ? "shipping"
    : null;
  if (kind) await notifyOrder(kind, { ...o, carrier, trackingNumber });
  redirect(`${to}?saved=1`);
}

// 이 사이트(DB)에 올린 이미지 주소: /api/product-image/이미지번호
const INTERNAL = /^\/api\/product-image\/([A-Za-z0-9_-]{10,40})$/;
const internalId = (url?: string | null) => (url ? INTERNAL.exec(url)?.[1] : undefined);
const internalIds = (urls: (string | null | undefined)[]) => urls.map(internalId).filter((x): x is string => Boolean(x));

// 이미지 주소: 비어 있으면 null, 올린 이미지나 http(s) 주소면 그 값, 그 밖의 값이면 false
function cleanImage(v: string): string | null | false {
  if (!v) return null;
  if (v.length > 2000) return false;
  if (INTERNAL.test(v)) return v;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : false;
  } catch {
    return false;
  }
}
const cleanColor = (v: string) => (/^#[0-9a-fA-F]{6}$/.test(v) ? v : "#e6e3de");
const IMG_ERR = "이미지는 파일로 올리거나, http:// 또는 https://로 시작하는 올바른 주소를 넣어 주세요.";
const DUP = "같은 카테고리에 같은 이름의 상품이 이미 있어요.";

export type ProductState = { error?: string } | undefined;

// 할인율: 비우면 할인 없음, 1~99 사이의 정수면 "7%" 형태로 저장, 그 밖의 값이면 false
function parseSale(v: string): string | null | false {
  const t = v.replace(/%/g, "").trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isInteger(n) && n >= 1 && n <= 99 ? `${n}%` : false;
}

// 추가 이미지: 최대 5장, 올바른 주소만, 같은 이미지는 한 번만. 문제가 있으면 false
function cleanExtras(values: FormDataEntryValue[]): string[] | false {
  const out: string[] = [];
  for (const raw of values) {
    const v = String(raw).trim();
    if (!v) continue;
    const c = cleanImage(v);
    if (!c) return false;
    if (!out.includes(c)) out.push(c);
  }
  return out.length > 5 ? false : out;
}

// 색상 옵션: "이름|#색상코드"를 최대 8개까지, 이름이 겹치면 하나만 둡니다. 형식이 맞지 않으면 null
function parseColorInputs(values: FormDataEntryValue[]): string[] | null {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of values) {
    const parts = String(raw).split("|");
    const name = (parts[0] ?? "").trim();
    if (!name) continue;
    if (parts.length > 2 || name.length > 20) return null;
    if (seen.has(name)) continue;
    seen.add(name);
    out.push(serializeColor({ name, hex: /^#[0-9a-fA-F]{6}$/.test(parts[1] ?? "") ? (parts[1] as string) : "#cccccc" }));
  }
  return out.length > MAX_COLORS ? null : out;
}

function readProduct(formData: FormData) {
  return {
    category: str(formData, "category"),
    name: str(formData, "name"),
    price: Number(str(formData, "price")),
    positionRaw: str(formData, "position"),
    sale: parseSale(str(formData, "sale")),
    bg: cleanColor(str(formData, "bg")),
    image: cleanImage(str(formData, "imageUrl")),
    description: str(formData, "description").slice(0, 2000) || null,
    subCategory: SUB_CATEGORIES.includes(str(formData, "subCategory")) ? str(formData, "subCategory") : null,
    inBest: formData.get("inBest") === "on", // BEST 카테고리에도 표시
    inNew: formData.get("inNew") === "on", // NEW 카테고리에도 표시
    soldOut: formData.get("soldOut") === "on", // 품절 표시
    extra: cleanExtras(formData.getAll("extraImages")),
    colors: parseColorInputs(formData.getAll("colors")),
  };
}

// 상품 입력값 검사. 문제가 있으면 안내 문구를 돌려줍니다.
function checkProduct(d: ReturnType<typeof readProduct>): string | null {
  if (!lists[d.category]) return "카테고리를 선택해 주세요.";
  if (!d.name) return "상품 이름을 입력해 주세요.";
  if (!Number.isInteger(d.price) || d.price < 0) return "가격은 0 이상의 숫자(원 단위)로 입력해 주세요.";
  if (d.image === false) return IMG_ERR;
  if (d.sale === false) return "할인율은 1~99 사이의 숫자로 입력해 주세요.";
  if (d.extra === false) return "추가 이미지는 올바른 이미지만 최대 5장까지 넣을 수 있어요.";
  if (d.colors === null) return `색상은 이름 20자 이하로 최대 ${MAX_COLORS}개까지 등록할 수 있어요.`;
  return null;
}

// 사이즈별 재고. 비우면 null(재고를 관리하지 않음 = 무제한), 숫자(0 포함)면 그 수량입니다.
function readStock(formData: FormData): { stock: Record<string, number | null>; error?: string } {
  const stock: Record<string, number | null> = {};
  for (const size of SIZES) {
    const raw = str(formData, `stock${size}`);
    if (!raw) {
      stock[size] = null;
      continue;
    }
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 0 || n > 100000) return { stock, error: "재고는 0 이상의 숫자로 입력해 주세요. (비우면 무제한)" };
    stock[size] = n;
  }
  return { stock };
}

export async function createProduct(_prev: ProductState, formData: FormData): Promise<ProductState> {
  await requireAdmin("/admin/products/new");
  const d = readProduct(formData);
  const problem = checkProduct(d);
  if (problem) return { error: problem };
  const st = readStock(formData);
  if (st.error) return { error: st.error };

  try {
    let position = Number(d.positionRaw);
    if (!d.positionRaw || !Number.isInteger(position)) {
      // 순서를 비워 두면 그 카테고리의 맨 뒤에 놓습니다.
      const max = await prisma.product.aggregate({ _max: { position: true }, where: { category: d.category } });
      position = (max._max.position ?? -1) + 1;
    }
    await prisma.product.create({
      data: {
        category: d.category,
        name: d.name,
        price: d.price,
        bg: d.bg,
        sale: d.sale as string | null,
        position,
        imageUrl: d.image as string | null,
        description: d.description,
        subCategory: d.subCategory,
        inBest: d.inBest,
        inNew: d.inNew,
        soldOut: d.soldOut,
        extraImages: d.extra as string[],
        colors: d.colors as string[],
        stocks: { create: SIZES.filter((s) => st.stock[s] !== null).map((s) => ({ size: s, quantity: st.stock[s] as number })) },
      },
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
  const st = readStock(formData);
  if (st.error) return { error: st.error };

  let oldImages: (string | null | undefined)[] = [];
  try {
    const position = Number(d.positionRaw || 0);
    await prisma.$transaction(async (tx) => {
      const prev = await tx.product.findUnique({ where: { id }, select: { imageUrl: true, extraImages: true } });
      oldImages = [prev?.imageUrl, ...(prev?.extraImages ?? [])];
      await tx.product.update({
        where: { id },
        data: { category: d.category, name: d.name, price: d.price, bg: d.bg, sale: d.sale as string | null, position: Number.isInteger(position) ? position : 0, imageUrl: d.image as string | null, description: d.description, subCategory: d.subCategory, inBest: d.inBest, inNew: d.inNew, soldOut: d.soldOut, extraImages: d.extra as string[], colors: d.colors as string[] },
      });
      for (const size of SIZES) {
        const quantity = st.stock[size];
        if (quantity === null) await tx.productStock.deleteMany({ where: { productId: id, size } });
        else await tx.productStock.upsert({ where: { productId_size: { productId: id, size } }, create: { productId: id, size, quantity }, update: { quantity } });
      }
    });
  } catch (e) {
    console.error("상품 수정 실패:", e);
    return { error: isDuplicate(e) ? DUP : "저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  // 더 이상 쓰지 않는 이전 이미지(대표·추가)는 DB에서 지웁니다.
  const keep = new Set(internalIds([d.image as string | null, ...(d.extra as string[])]));
  const drop = internalIds(oldImages).filter((x) => !keep.has(x));
  if (drop.length > 0) await prisma.productImage.deleteMany({ where: { id: { in: drop } } });
  redirect("/admin/products?saved=1");
}

const back = (msg?: string): never => redirect(`/admin/products?${msg ? `error=${encodeURIComponent(msg)}` : "saved=1"}`);

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(str(formData, "id"));
  if (Number.isInteger(id)) {
    const product = await prisma.product.findUnique({ where: { id }, select: { imageUrl: true, extraImages: true } });
    await prisma.product.deleteMany({ where: { id } });
    const imageIds = internalIds([product?.imageUrl, ...(product?.extraImages ?? [])]);
    if (imageIds.length > 0) await prisma.productImage.deleteMany({ where: { id: { in: imageIds } } });
  }
  back();
}

// 없어진 카테고리(예: men)에 남아 있는 상품을 한꺼번에 삭제합니다.
export async function deleteRemovedCategoryProducts() {
  await requireAdmin();
  const gone = await prisma.product.findMany({ where: { category: { notIn: Object.keys(lists) } }, select: { id: true, imageUrl: true, extraImages: true } });
  if (gone.length > 0) {
    await prisma.product.deleteMany({ where: { id: { in: gone.map((p) => p.id) } } });
    const imageIds = internalIds(gone.flatMap((p) => [p.imageUrl, ...p.extraImages]));
    if (imageIds.length > 0) await prisma.productImage.deleteMany({ where: { id: { in: imageIds } } });
  }
  back();
}

// 품절 처리 / 품절 해제 (재고 숫자와 상관없이 상품 전체를 품절로 표시합니다)
export async function toggleSoldOut(formData: FormData) {
  await requireAdmin();
  const id = Number(str(formData, "id"));
  if (Number.isInteger(id)) {
    const product = await prisma.product.findUnique({ where: { id }, select: { soldOut: true } });
    if (product) await prisma.product.update({ where: { id }, data: { soldOut: !product.soldOut } });
  }
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
