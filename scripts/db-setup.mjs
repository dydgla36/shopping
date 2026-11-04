// 배포(빌드)할 때 DB에 필요한 테이블·컬럼을 자동으로 만듭니다.
// - "이미 있으면 건너뛰기" 명령만 쓰기 때문에 여러 번 실행해도 안전하고, 기존 데이터는 지워지지 않습니다.
// - 어떤 이유로든(DB에 접속할 수 없거나, 일부 명령이 실패하거나, 도구를 불러오지 못해도) 빌드는 멈추지 않고 로그만 남깁니다.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    console.log("[db-setup] DATABASE_URL이 없어 건너뜁니다.");
    return;
  }
  const statements = JSON.parse(readFileSync(new URL("../prisma/setup-statements.json", import.meta.url), "utf8"));
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  let failed = 0;
  try {
    for (const sql of statements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (e) {
        failed += 1;
        console.error("[db-setup] 실패:", sql.slice(0, 90), "→", String(e?.message ?? e).split("\n").filter(Boolean).pop());
      }
    }
    console.log(`[db-setup] ${statements.length - failed}/${statements.length}개 명령 완료${failed ? ` (실패 ${failed}개)` : ""}`);
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

main()
  .catch((e) => console.error("[db-setup] 건너뜁니다:", String(e?.message ?? e).split("\n").filter(Boolean).pop()))
  .finally(() => process.exit(0));
