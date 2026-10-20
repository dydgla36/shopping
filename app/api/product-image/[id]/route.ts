import { prisma } from "@/lib/db";

// 상품 이미지를 보여주는 주소입니다. (/api/product-image/이미지번호) 누구나 볼 수 있습니다.
// 이미지를 바꾸면 새 번호가 생기므로, 한 번 받은 이미지는 오래 저장해 두어도 안전합니다.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let row: { mime: string; data: Uint8Array } | null = null;
  try {
    row = await prisma.productImage.findUnique({ where: { id }, select: { mime: true, data: true } });
  } catch (e) {
    console.error("이미지 조회 실패:", e);
    return new Response("Error", { status: 500 });
  }
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
