"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";

export type FormState = { error?: string } | undefined;

const str = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
// 로그인 후 돌아갈 주소는 이 사이트 안의 주소만 허용합니다.
const safeNext = (n: string) => (n.startsWith("/") && !n.startsWith("//") ? n : "/");
const NO_DB = "아직 데이터베이스가 연결되지 않았어요. README의 'DB 연결'을 먼저 진행해 주세요.";

export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!process.env.DATABASE_URL) return { error: NO_DB };

  const loginId = str(formData, "loginId");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const phone = str(formData, "phone");

  if (!/^[A-Za-z0-9]{4,16}$/.test(loginId)) return { error: "아이디는 영문, 숫자 4~16자로 입력해 주세요." };
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
    return { error: "비밀번호는 영문, 숫자를 포함해 8자 이상이어야 해요." };
  if (password !== passwordConfirm) return { error: "비밀번호 확인이 일치하지 않아요." };
  if (!name) return { error: "이름을 입력해 주세요." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "이메일 형식을 확인해 주세요." };
  if (!/^[0-9-]{9,13}$/.test(phone)) return { error: "휴대전화 번호를 확인해 주세요." };
  if (formData.get("terms") !== "on" || formData.get("privacy") !== "on")
    return { error: "필수 약관에 동의해 주세요." };

  let userId: number;
  try {
    const exists = await prisma.user.findFirst({ where: { OR: [{ loginId }, { email }] } });
    if (exists) return { error: "이미 사용 중인 아이디 또는 이메일이에요." };
    const user = await prisma.user.create({
      data: {
        loginId,
        passwordHash: hashPassword(password),
        name,
        email,
        phone,
        marketingOptIn: formData.get("marketing") === "on",
        termsAgreedAt: new Date(),
      },
    });
    userId = user.id;
    await createSession(userId, 1);
  } catch (e) {
    console.error("회원가입 실패:", e);
    return { error: "회원가입 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect("/");
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!process.env.DATABASE_URL) return { error: NO_DB };

  const loginId = str(formData, "loginId");
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";
  const next = safeNext(str(formData, "next"));
  if (!loginId || !password) return { error: "아이디와 비밀번호를 입력해 주세요." };

  try {
    const user = await prisma.user.findUnique({ where: { loginId } });
    // 아이디가 없어도 같은 시간이 걸리도록 해시 계산을 한 번 합니다.
    const ok = user ? verifyPassword(password, user.passwordHash) : (hashPassword(password), false);
    if (!user || !ok) return { error: "아이디 또는 비밀번호가 올바르지 않아요." };
    await createSession(user.id, remember ? 30 : 1);
  } catch (e) {
    console.error("로그인 실패:", e);
    return { error: "로그인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
  redirect(next);
}

export async function logout() {
  await destroySession();
  redirect("/");
}
