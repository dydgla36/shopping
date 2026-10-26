import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { siteBase } from "@/lib/email";
import { safeNext } from "@/lib/redirect";

// 카카오 로그인 시작: 확인용 값(state)을 쿠키에 저장하고 카카오 로그인 화면으로 보냅니다.
export async function GET(req: Request) {
  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) return redirect("/login?kakao=off");

  const next = safeNext(new URL(req.url).searchParams.get("next") ?? "/");
  const state = randomBytes(16).toString("hex");
  (await cookies()).set("kakao_oauth", JSON.stringify({ state, next }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  const redirectUri = `${await siteBase()}/api/auth/kakao/callback`;
  redirect(`https://kauth.kakao.com/oauth/authorize?${new URLSearchParams({ client_id: key, redirect_uri: redirectUri, response_type: "code", state })}`);
}
