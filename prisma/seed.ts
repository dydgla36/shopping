import { PrismaClient } from "@prisma/client";
import { lists } from "../lib/lists";

const prisma = new PrismaClient();
const toInt = (price: string) => Number(price.replace(/[^0-9]/g, ""));

async function main() {
  // 모든 샘플 상품은 WOMEN 카테고리에 넣고, BEST·NEW 목록에 있던 상품은 표시(inBest, inNew)만 켭니다.
  const rows = new Map<string, { category: string; name: string; price: number; bg: string; sale: string | null; position: number; inBest: boolean; inNew: boolean }>();
  let position = 0;
  for (const slug of ["women", "best", "new"]) {
    for (const item of lists[slug]?.items ?? []) {
      const row = rows.get(item.name) ?? { category: "women", name: item.name, price: toInt(item.price), bg: item.bg, sale: item.sale ?? null, position: position++, inBest: false, inNew: false };
      if (slug === "best") row.inBest = true;
      if (slug === "new") row.inNew = true;
      rows.set(item.name, row);
    }
  }
  // 샘플 데이터를 다시 넣으므로, 실행하면 기존 상품이 초기화됩니다.
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: [...rows.values()] });
  console.log(`${rows.size}개 상품을 넣었습니다.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
