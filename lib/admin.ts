import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

// 관리자만 통과시킵니다. 로그인하지 않았으면 로그인 화면으로, 일반 회원이면 메인으로 보냅니다.
// 관리자 화면과 관리자 동작(서버 액션)은 모두 맨 처음에 이 함수를 호출해야 합니다.
export async function requireAdmin(next = "/admin") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
