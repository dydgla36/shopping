import { getCurrentUser } from "@/lib/auth";
import { jsonError, saveImageFromRequest } from "@/lib/imageUpload";

// 관리자가 상품 이미지 파일을 올리는 주소입니다.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return jsonError("권한이 없어요.", 403);
  return saveImageFromRequest(req);
}
