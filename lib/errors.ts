// Prisma의 "이미 있는 값" 오류(P2002)인지 확인합니다.
export const isDuplicate = (e: unknown) => (e as { code?: string })?.code === "P2002";
