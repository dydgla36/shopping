import { getCurrentUser } from "@/lib/auth";
import { jsonError, saveImageFromRequest } from "@/lib/imageUpload";
import { hit } from "@/lib/rateLimit";

// 회원이 후기 사진을 올리는 주소입니다. (로그인한 회원만, 1시간에 30장까지)
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("로그인이 필요해요.", 401);
  if (!(await hit(`review-photo:${user.id}`, 30, 60 * 60 * 1000))) return jsonError("사진을 너무 많이 올렸어요. 잠시 후 다시 시도해 주세요.", 429);
  return saveImageFromRequest(req);
}
