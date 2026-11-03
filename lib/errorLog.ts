import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";
import { emailConfigured, sendEmail, siteBase } from "@/lib/email";
import { esc } from "@/lib/html";
import { hit } from "@/lib/rateLimit";

// 사이트에서 난 오류를 DB(ErrorLog)에 모으고, 새로운 오류가 나면 관리자에게 메일(ADMIN_EMAIL)로 알립니다.
// 같은 곳에서 같은 오류가 반복되면 한 줄로 모아 횟수만 늘립니다. 오류를 기록하다가 다시 오류가 나도 조용히 넘어갑니다.
const redact = (v: string) => v.replace(/postgres(?:ql)?:\/\/\S+/gi, "[DB 주소 숨김]");

export async function reportError(input: { error: unknown; path?: string | null; source: "server" | "client"; digest?: string }) {
  try {
    const err = input.error;
    const message = redact(err instanceof Error ? err.message : String(err)).slice(0, 500) || "알 수 없는 오류";
    const digest = input.digest ?? (err as { digest?: string } | null)?.digest;
    // 가장 최근 발생의 번호(digest)와 호출 기록을 남겨서, 고객이 알려준 오류 번호로 찾을 수 있게 합니다.
    const stack = redact([digest ? `digest: ${digest}` : "", err instanceof Error ? (err.stack ?? "") : ""].filter(Boolean).join("\n")).slice(0, 3000) || null;
    const path = input.path ? input.path.slice(0, 200) : null;
    const key = createHash("sha1").update(`${input.source}|${path ?? ""}|${message}`).digest("hex");

    const row = await prisma.errorLog.upsert({
      where: { key },
      create: { key, source: input.source, message, stack, path },
      update: { count: { increment: 1 }, lastAt: new Date(), stack },
    });

    // 새로운 오류이거나 10·100·1000번째 반복일 때만 알립니다. (메일이 쏟아지지 않게 1시간에 5통까지)
    const notable = row.count === 1 || [10, 100, 1000].includes(row.count);
    if (notable && process.env.ADMIN_EMAIL && emailConfigured() && (await hit("error-mail", 5, 60 * 60 * 1000))) {
      const base = await siteBase();
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `[GABBY] 사이트 오류${row.count > 1 ? ` (${row.count}번째)` : ""}: ${message.slice(0, 60)}`,
        `<p>사이트에서 오류가 났어요. (${input.source === "client" ? "고객 화면" : "서버"} · ${row.count}번째)</p><p>위치: ${esc(path ?? "-")}<br>내용: ${esc(message)}</p><p><a href="${base}/admin/errors">오류 기록 보기</a></p>`,
      );
    }
  } catch (e) {
    console.error("오류 기록 실패:", e);
  }
}
