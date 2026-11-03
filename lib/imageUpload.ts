import { prisma } from "@/lib/db";

// 이미지 파일을 받아 DB(ProductImage 테이블)에 저장하고 "/api/product-image/이미지번호" 주소를 돌려줍니다.
// 관리자 상품 이미지와 고객 후기 사진이 같이 씁니다. (누가 올릴 수 있는지는 각 주소에서 먼저 확인합니다)
// DB 용량을 아끼려고 2MB까지만 받습니다. (화면이 큰 이미지는 올리기 전에 자동으로 줄입니다.)
const MAX = 2 * 1024 * 1024;

// 파일 앞부분(매직 바이트)으로 실제 이미지인지 확인합니다. 브라우저가 알려 준 파일 종류는 믿지 않습니다.
function sniff(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "image/gif";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}

export const jsonError = (error: string, status: number) => Response.json({ error }, { status });

export async function saveImageFromRequest(req: Request): Promise<Response> {
  let file: FormDataEntryValue | null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return jsonError("파일을 읽을 수 없어요.", 400);
  }
  if (!(file instanceof File)) return jsonError("파일을 선택해 주세요.", 400);
  if (file.size === 0) return jsonError("빈 파일이에요.", 400);
  if (file.size > MAX) return jsonError("이미지는 줄여도 2MB를 넘을 수 없어요. 더 작은 이미지를 올려 주세요.", 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniff(bytes);
  if (!mime) return jsonError("JPG, PNG, WEBP, GIF 이미지 파일만 올릴 수 있어요.", 400);

  try {
    const image = await prisma.productImage.create({ data: { mime, size: bytes.length, data: bytes }, select: { id: true } });
    return Response.json({ url: `/api/product-image/${image.id}` });
  } catch (e) {
    console.error("이미지 저장 실패:", e);
    return jsonError("이미지 저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.", 500);
  }
}
