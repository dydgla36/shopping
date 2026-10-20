"use server";

import { headers } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { hashPassword, requireUser, verifyPassword } from "@/lib/auth";
import { emailConfigured, sendEmail } from "@/lib/email";
import { maskLoginId } from "@/lib/mask";
import { emailOk, passwordProblem, phoneOk } from "@/lib/validate";
import { isDuplicate } from "@/lib/errors";
import type { ActionState } from "@/components/ActionForm";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

// ---- 회원 정보 수정
export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("/profile-edit");
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const phone = str(formData, "phone");
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
  const user = await prisma.user.findFirst({ where: { name, email, role: "USER" }, select: { loginId: true } });
  if (!user) return { error: "일치하는 회원 정보가 없어요." };
  return { ok: `가입하신 아이디는 ${maskLoginId(user.loginId)} 입니다. (개인정보 보호를 위해 일부를 가렸어요)` };
}

// ---- 비밀번호 찾기: 이메일로 재설정 링크를 보냅니다. (회원이 있는지는 알려주지 않습니다)
export async function requestReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const loginId = str(formData, "loginId");
  const email = str(formData, "email").toLowerCase();
  if (!loginId || !emailOk(email)) return { error: "아이디와 이메일을 정확히 입력해 주세요." };
  if (!emailConfigured()) return { error: "이메일 발송 서비스가 아직 연결되지 않아 메일을 보낼 수 없어요. 관리자에게 문의해 주세요." };

  const generic: ActionState = { ok: "입력하신 정보가 맞다면 비밀번호 재설정 메일을 보냈어요. 메일함(스팸함 포함)을 확인해 주세요. 링크는 1시간 동안 유효해요." };
  const user = await prisma.user.findFirst({ where: { loginId, email, role: "USER" } });
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
