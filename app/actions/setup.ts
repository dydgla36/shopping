"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { SETUP_STATEMENTS } from "@/lib/setup";
import type { ActionState } from "@/components/ActionForm";

// 사이트가 쓰는 테이블을 만듭니다. 고정된 명령만 한 문장씩 실행하고(입력값 없음), 관리자만 실행할 수 있습니다.
export async function runSetup(): Promise<ActionState> {
  await requireAdmin("/admin/setup");
  const failed: string[] = [];
  for (const sql of SETUP_STATEMENTS) {
    try {
      await prisma.$executeRawUnsafe(sql);
    } catch (e) {
      const msg = e instanceof Error ? (e.message.split("\n").filter(Boolean).pop() ?? e.message) : String(e);
      failed.push(`${sql.slice(0, 70)} → ${msg}`);
    }
  }
  const total = SETUP_STATEMENTS.length;
  if (failed.length) return { error: `${total - failed.length}/${total}개 완료, ${failed.length}개 실패: ${failed.join(" | ")}` };
  return { ok: `${total}개 명령을 모두 실행했어요. (이미 있는 것은 건너뛰었어요)` };
}
