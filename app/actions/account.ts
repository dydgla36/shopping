"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { destroySession, hashPassword, requireUser, verifyPassword } from "@/lib/auth";
import { emailConfigured, sendEmail } from "@/lib/email";
import { maskLoginId } from "@/lib/mask";
import { emailOk, formatPhone, passwordProblem, phoneOk } from "@/lib/validate";
import { isDuplicate } from "@/lib/errors";
import { clientIp, hit } from "@/lib/rateLimit";
import type { ActionState } from "@/components/ActionForm";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

// ---- 회원 정보 수정
export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("/profile-edit");
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const phone = formatPhone(str(formData, "phone"));
  if (!name) return { error: "이름을 입력해 주세요." };
  if (!emailOk(email)) return { error: "이메일 형식을 확인해 주세요." };
  if (!phoneOk(phone)) return { error: "휴대전화 번호를 확인해 주세요." };
  try {
    await prisma.user.update({ where: { id: user.id }, data: { name, email, phone, marketingOptIn: formData.get("marketing") === "on" } });
  } catch (e) {
    return { error: isDuplicate(e) ? "이미 사용 중인 이메일이에요." : "저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  return { ok: "회원 정보를 저장했어요." };
}

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireUser("/profile-edit");
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const user = await prisma.user.findUnique({ where: { id: me.id } });
  if (!user || !verifyPassword(current, user.passwordHash)) return { error: "현재 비밀번호가 올바르지 않아요." };
  const problem = passwordProblem(next);
  if (problem) return { error: problem };
  if (next !== confirm) return { error: "새 비밀번호 확인이 일치하지 않아요." };
  if (next === current) return { error: "현재 비밀번호와 다른 비밀번호를 입력해 주세요." };
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(next) } });
  return { ok: "비밀번호를 바꿨어요." };
}

// ---- 아이디 찾기: 이름과 이메일이 맞으면 아이디 일부를 가려서 알려줍니다.
export async function findId(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  if (!name || !emailOk(email)) return { error: "이름과 이메일을 정확히 입력해 주세요." };
  if (!(await hit(`find-id:${await clientIp()}`, 10, 10 * 60 * 1000))) return { error: "요청이 너무 많아요. 10분 뒤에 다시 시도해 주세요." };
  const user = await prisma.user.findFirst({ where: { name, email, role: "USER", deletedAt: null }, select: { loginId: true } });
  if (!user) return { error: "일치하는 회원 정보가 없어요." };
  return { ok: `가입하신 아이디는 ${maskLoginId(user.loginId)} 입니다. (개인정보 보호를 위해 일부를 가렸어요)` };
}

// ---- 비밀번호 찾기: 이메일로 재설정 링크를 보냅니다. (회원이 있는지는 알려주지 않습니다)
export async function requestReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const loginId = str(formData, "loginId");
  const email = str(formData, "email").toLowerCase();
  if (!loginId || !emailOk(email)) return { error: "아이디와 이메일을 정확히 입력해 주세요." };
  // 같은 접속지에서 1시간에 5번, 같은 이메일로는 1시간에 3번까지만 요청할 수 있습니다. (메일 폭탄 방지)
  if (!(await hit(`reset:ip:${await clientIp()}`, 5, 60 * 60 * 1000)) || !(await hit(`reset:email:${email}`, 3, 60 * 60 * 1000))) return { error: "요청이 너무 많아요. 1시간 뒤에 다시 시도해 주세요." };
  if (!emailConfigured()) return { error: "이메일 발송 서비스가 아직 연결되지 않아 메일을 보낼 수 없어요. 관리자에게 문의해 주세요." };

  const generic: ActionState = { ok: "입력하신 정보가 맞다면 비밀번호 재설정 메일을 보냈어요. 메일함(스팸함 포함)을 확인해 주세요. 링크는 1시간 동안 유효해요." };
  const user = await prisma.user.findFirst({ where: { loginId, email, role: "USER", deletedAt: null } });
  if (!user) return generic;

  const token = randomBytes(32).toString("hex");
  await prisma.passwordReset.deleteMany({ where: { userId: user.id, usedAt: null } });
  await prisma.passwordReset.create({ data: { userId: user.id, tokenHash: sha256(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });

  const h = await headers();
  const base = process.env.SITE_URL ?? `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const link = `${base}/reset-password?token=${token}`;
  try {
    await sendEmail(user.email, "[GABBY] 비밀번호 재설정 안내", `<p>${user.name}님, 비밀번호 재설정을 요청하셨어요.</p><p>아래 링크에서 새 비밀번호를 설정해 주세요. (1시간 동안 유효)</p><p><a href="${link}">${link}</a></p><p>요청하지 않으셨다면 이 메일을 무시해 주세요.</p>`);
  } catch (e) {
    console.error("재설정 메일 발송 실패:", e);
    return { error: "메일을 보내는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  return generic;
}

export async function resetPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const token = str(formData, "token");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const problem = passwordProblem(next);
  if (problem) return { error: problem };
  if (next !== confirm) return { error: "새 비밀번호 확인이 일치하지 않아요." };

  const reset = token ? await prisma.passwordReset.findUnique({ where: { tokenHash: sha256(token) } }) : null;
  if (!reset || reset.usedAt || reset.expiresAt < new Date()) return { error: "링크가 만료되었거나 이미 사용했어요. 비밀번호 찾기를 다시 진행해 주세요." };

  await prisma.$transaction([
    prisma.user.update({ where: { id: reset.userId }, data: { passwordHash: hashPassword(next) } }),
    prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
    prisma.session.deleteMany({ where: { userId: reset.userId } }), // 다른 기기의 로그인은 모두 풀립니다.
  ]);
  return { ok: "비밀번호를 바꿨어요. 새 비밀번호로 로그인해 주세요." };
}

// ---- 회원 탈퇴
// 주문·결제·배송 기록은 법령에 따라 일정 기간 보관해야 해서 지우지 않고, 회원 정보를 지운 "탈퇴한 회원"으로 바꿔 둡니다.
// 그 밖의 개인 정보(배송지, 장바구니, 관심 상품, 쿠폰, 적립금, 후기, 문의, 로그인 기록)는 지웁니다.
export async function withdrawAccount(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireUser("/profile-edit");
  if (me.role === "ADMIN") return { error: "관리자 계정은 탈퇴할 수 없어요." };
  const user = await prisma.user.findUnique({ where: { id: me.id }, select: { id: true, email: true, passwordHash: true, kakaoId: true } });
  if (!user) return { error: "회원 정보를 찾을 수 없어요." };

  // 본인 확인: 일반 회원은 비밀번호, 카카오로 가입한 회원은 "탈퇴"라고 입력
  if (user.kakaoId) {
    if (str(formData, "confirm") !== "탈퇴") return { error: "확인을 위해 입력칸에 \"탈퇴\"라고 적어 주세요." };
  } else if (!verifyPassword(String(formData.get("password") ?? ""), user.passwordHash)) {
    return { error: "비밀번호가 올바르지 않아요." };
  }
  if (formData.get("agree") !== "on") return { error: "안내를 확인하고 동의에 체크해 주세요." };

  // 배송 중이거나 처리 중인 주문·신청이 있으면 탈퇴할 수 없습니다.
  const [activeOrders, openClaims] = await Promise.all([
    prisma.order.count({ where: { userId: user.id, status: { in: ["PENDING", "PAID", "PREPARING", "SHIPPING"] } } }),
    prisma.claim.count({ where: { userId: user.id, status: { in: ["RECEIVED", "PROCESSING"] } } }),
  ]);
  if (activeOrders > 0) return { error: `진행 중인 주문이 ${activeOrders}건 있어요. 배송이 끝나거나 취소된 뒤에 탈퇴할 수 있어요.` };
  if (openClaims > 0) return { error: "처리 중인 취소·반품·교환 신청이 있어요. 처리가 끝난 뒤에 탈퇴할 수 있어요." };

  try {
    await prisma.$transaction(async (tx) => {
      const reviews = await tx.review.findMany({ where: { userId: user.id }, select: { photos: true } });
      const photoIds = reviews.flatMap((r) => r.photos).map((u) => /^\/api\/product-image\/([A-Za-z0-9_-]{10,40})$/.exec(u)?.[1]).filter((x): x is string => Boolean(x));
      if (photoIds.length > 0) await tx.productImage.deleteMany({ where: { id: { in: photoIds } } });
      await Promise.all([
        tx.session.deleteMany({ where: { userId: user.id } }),
        tx.passwordReset.deleteMany({ where: { userId: user.id } }),
        tx.cartItem.deleteMany({ where: { userId: user.id } }),
        tx.wishlistItem.deleteMany({ where: { userId: user.id } }),
        tx.userCoupon.deleteMany({ where: { userId: user.id } }),
        tx.pointLog.deleteMany({ where: { userId: user.id } }),
        tx.address.deleteMany({ where: { userId: user.id } }),
        tx.review.deleteMany({ where: { userId: user.id } }),
        tx.question.deleteMany({ where: { userId: user.id } }),
        tx.restockAlert.deleteMany({ where: { email: user.email } }),
      ]);
      await tx.user.update({
        where: { id: user.id },
        data: {
          loginId: `withdrawn_${user.id}`,
          email: `withdrawn_${user.id}@withdrawn.local`,
          name: "탈퇴한 회원",
          phone: "",
          passwordHash: hashPassword(randomBytes(24).toString("hex")),
          kakaoId: null,
          marketingOptIn: false,
          deletedAt: new Date(),
        },
      });
    });
  } catch (e) {
    console.error("회원 탈퇴 실패:", e);
    return { error: "탈퇴 처리 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  await destroySession();
  redirect("/");
}
