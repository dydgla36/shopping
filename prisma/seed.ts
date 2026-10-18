import { PrismaClient } from "@prisma/client";
import { lists } from "../lib/lists";

const prisma = new PrismaClient();
const toInt = (price: string) => Number(price.replace(/[^0-9]/g, ""));

async function main() {
  const data = Object.entries(lists).flatMap(([category, list]) =>
    list.items.map((item, position) => ({
      category,
      name: item.name,
      price: toInt(item.price),
      bg: item.bg,
      sale: item.sale ?? null,
      position,
    })),
  );
  // 샘플 데이터를 다시 넣으므로, 실행하면 기존 상품이 초기화됩니다.
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data });
  console.log(`${data.length}개 상품을 넣었습니다.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
