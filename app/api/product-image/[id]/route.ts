import { prisma } from "@/lib/db";

// 상품 이미지를 보여주는 주소입니다. (/api/product-image/이미지번호) 누구나 볼 수 있습니다.
// ?w=240|480|800 을 붙이면 그 가로 크기로 줄인 가벼운 이미지(webp)를 보냅니다. 줄이지 못하면 원본을 보냅니다.
// 이미지를 바꾸면 새 번호가 생기므로, 한 번 받은 이미지는 오래 저장해 두어도 안전합니다.
const WIDTHS = new Set([240, 480, 800]);
const COMMON = { "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" };

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const width = Number(new URL(req.url).searchParams.get("w"));
  let row: { mime: string; data: Uint8Array } | null = null;
  try {
    row = await prisma.productImage.findUnique({ where: { id }, select: { mime: true, data: true } });
  } catch (e) {
    console.error("이미지 조회 실패:", e);
    return new Response("Error", { status: 500 });
  }
  if (!row) return new Response("Not found", { status: 404 });

  // 움직이는 GIF는 그대로 보냅니다.
  if (WIDTHS.has(width) && row.mime !== "image/gif") {
    try {
      const sharp = (await import("sharp")).default;
      const out = await sharp(Buffer.from(row.data)).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
      return new Response(new Uint8Array(out), { headers: { ...COMMON, "Content-Type": "image/webp" } });
    } catch (e) {
      console.error("썸네일 만들기에 실패해 원본을 보냅니다:", e);
    }
  }
  return new Response(new Uint8Array(row.data), { headers: { ...COMMON, "Content-Type": row.mime } });
}
