import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";

const COOKIE = "session";

// 비밀번호는 원문이 아니라 "salt:해시" 형태로만 저장합니다. (Node 내장 scrypt 사용)
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// 로그인: Session 테이블에 행을 만들고, 그 id를 httpOnly 쿠키에 저장합니다.
export async function createSession(userId: number, days: number) {
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({ data: { userId, expiresAt } });
  (await cookies()).set(COOKIE, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// 현재 로그인한 회원 (없거나 만료되었으면 null)
export async function getCurrentUser() {
  if (!process.env.DATABASE_URL) return null;
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;
  try {
    const session = await prisma.session.findUnique({ where: { id }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) return null;
    return { id: session.user.id, name: session.user.name, loginId: session.user.loginId };
  } catch (e) {
    console.error("세션 조회 실패:", e);
    return null;
  }
}

export async function destroySession() {
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  if (id) await prisma.session.deleteMany({ where: { id } });
  store.delete(COOKIE);
}

// 로그인이 필요한 화면에서 호출합니다. 로그인하지 않았으면 로그인 화면으로 보내고,
// 로그인 후 원래 가려던 주소(next)로 돌아오게 합니다.
export async function requireUser(next: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}
