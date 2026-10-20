import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// 관리자가 상품 이미지 파일을 올리는 주소입니다. 파일은 DB(ProductImage 테이블)에 저장됩니다.
// DB 용량을 아끼려고 2MB까지만 받습니다. (관리자 화면이 큰 이미지는 올리기 전에 자동으로 줄입니다.)
const MAX = 2 * 1024 * 1024;

// 파일 앞부분(매직 바이트)으로 실제 이미지인지 확인합니다. 브라우저가 알려 준 파일 종류는 믿지 않습니다.
function sniff(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "image/gif";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}

const fail = (error: string, status: number) => Response.json({ error }, { status });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return fail("권한이 없어요.", 403);

  let file: FormDataEntryValue | null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return fail("파일을 읽을 수 없어요.", 400);
  }
  if (!(file instanceof File)) return fail("파일을 선택해 주세요.", 400);
  if (file.size === 0) return fail("빈 파일이에요.", 400);
  if (file.size > MAX) return fail("이미지는 줄여도 2MB를 넘을 수 없어요. 더 작은 이미지를 올려 주세요.", 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniff(bytes);
  if (!mime) return fail("JPG, PNG, WEBP, GIF 이미지 파일만 올릴 수 있어요.", 400);

  try {
    const image = await prisma.productImage.create({ data: { mime, size: bytes.length, data: bytes }, select: { id: true } });
    return Response.json({ url: `/api/product-image/${image.id}` });
  } catch (e) {
    console.error("이미지 저장 실패:", e);
    return fail("이미지 저장 중 문제가 생겼어요. 'ProductImage' 테이블을 만들었는지 확인해 주세요.", 500);
  }
}
