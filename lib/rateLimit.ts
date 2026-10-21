import { headers } from "next/headers";
import { prisma } from "@/lib/db";

// 횟수 제한 도구. 제한 테이블(RateLimit)이 아직 없으면 오류를 기록하고 제한 없이 통과시킵니다(사이트가 멈추지 않게).

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
}

// 지금 잠겨 있으면 남은 초, 아니면 0
export async function lockedSeconds(key: string): Promise<number> {
  try {
    const row = await prisma.rateLimit.findUnique({ where: { key } });
    if (row?.lockedUntil && row.lockedUntil > new Date()) return Math.ceil((row.lockedUntil.getTime() - Date.now()) / 1000);
  } catch (e) {
    console.error("횟수 제한 조회 실패:", e);
  }
  return 0;
}

// 실패 1회를 기록합니다. 기간(windowMs) 안에 max번 실패하면 lockMs 동안 잠급니다.
export async function recordFailure(key: string, max: number, windowMs: number, lockMs: number) {
  try {
    const now = new Date();
    const row = await prisma.rateLimit.findUnique({ where: { key } });
    const fresh = !row || now.getTime() - row.windowStart.getTime() > windowMs;
    const count = fresh ? 1 : row.count + 1;
    const lockedUntil = count >= max ? new Date(now.getTime() + lockMs) : null;
    const data = { count: lockedUntil ? 0 : count, windowStart: fresh || lockedUntil ? now : row.windowStart, lockedUntil };
    await prisma.rateLimit.upsert({ where: { key }, create: { key, ...data }, update: data });
  } catch (e) {
    console.error("횟수 제한 기록 실패:", e);
  }
}

export async function clearLimit(key: string) {
  try {
    await prisma.rateLimit.deleteMany({ where: { key } });
  } catch (e) {
    console.error("횟수 제한 초기화 실패:", e);
  }
}

// 호출할 때마다 1회로 세고, 기간(windowMs) 안에 max번을 넘으면 false를 돌려줍니다.
export async function hit(key: string, max: number, windowMs: number): Promise<boolean> {
  try {
    const now = new Date();
    const row = await prisma.rateLimit.findUnique({ where: { key } });
    const fresh = !row || now.getTime() - row.windowStart.getTime() > windowMs;
    const count = fresh ? 1 : row.count + 1;
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, count, windowStart: now },
      update: { count, windowStart: fresh ? now : row.windowStart },
    });
    return count <= max;
  } catch (e) {
    console.error("횟수 제한 확인 실패:", e);
    return true;
  }
}
