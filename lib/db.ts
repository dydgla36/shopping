import { PrismaClient } from "@prisma/client";

// 개발 중 파일이 다시 불러와져도 DB 연결이 계속 늘어나지 않게 하나만 만듭니다.
const g = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = g.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") g.prisma = prisma;
