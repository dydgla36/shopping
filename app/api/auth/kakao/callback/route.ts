import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { siteBase } from "@/lib/email";
import { isDuplicate } from "@/lib/errors";
import { safeNext } from "@/lib/redirect";

type KakaoMe = {
  id: number;
  properties?: { nickname?: string };
  kakao_account?: { email?: string; is_email_verified?: boolean; profile?: { nickname?: string } };
};

// 카카오 로그인 완료: 카카오에서 받은 코드로 회원 정보를 확인하고, 처음이면 회원을 만들고, 로그인 처리합니다.
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const code = params.get("code");
  const store = await cookies();
  const saved = store.get("kakao_oauth")?.value;
  store.delete("kakao_oauth");

  // 시작할 때 저장해 둔 확인용 값(state)과 같아야 합니다. (다른 사이트에서 몰래 로그인시키는 것을 막습니다)
  let flow: { state: string; next: string } | null = null;
  try {
    flow = saved ? (JSON.parse(saved) as { state: string; next: string }) : null;
  } catch {
    flow = null;
  }
  if (!code || !flow || flow.state !== params.get("state")) return redirect("/login?kakao=fail");
  const key = process.env.KAKAO_REST_API_KEY;
  if (!key) return redirect("/login?kakao=off");

  let me: KakaoMe | null = null;
  try {
    const redirectUri = `${await siteBase()}/api/auth/kakao/callback`;
    const body = new URLSearchParams({ grant_type: "authorization_code", client_id: key, redirect_uri: redirectUri, code });
    if (process.env.KAKAO_CLIENT_SECRET) body.set("client_secret", process.env.KAKAO_CLIENT_SECRET);
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" }, body });
    const token = (await tokenRes.json()) as { access_token?: string };
    if (!tokenRes.ok || !token.access_token) throw new Error(`카카오 토큰 요청 실패 (${tokenRes.status})`);
    const meRes = await fetch("https://kapi.kakao.com/v2/user/me", { headers: { Authorization: `Bearer ${token.access_token}` } });
    if (!meRes.ok) throw new Error(`카카오 회원 정보 요청 실패 (${meRes.status})`);
    me = (await meRes.json()) as KakaoMe;
  } catch (e) {
    console.error("카카오 로그인 실패:", e);
  }
  if (!me?.id) return redirect("/login?kakao=fail");

  const kakaoId = String(me.id);
  let userId: number | null = null;
  try {
    const found = await prisma.user.findUnique({ where: { kakaoId }, select: { id: true } });
    if (found) {
      userId = found.id;
    } else {
      // 처음 로그인: 회원을 만듭니다. (다른 일반 회원과 이메일만 같다고 합치지는 않습니다. 계정 탈취를 막기 위해서예요)
      const name = me.kakao_account?.profile?.nickname ?? me.properties?.nickname ?? "카카오 회원";
      const email = me.kakao_account?.is_email_verified && me.kakao_account.email ? me.kakao_account.email.toLowerCase() : null;
      const base = { loginId: `kakao_${kakaoId}`, kakaoId, passwordHash: hashPassword(randomBytes(24).toString("hex")), name: name.slice(0, 30), phone: "", termsAgreedAt: new Date() };
      try {
        userId = (await prisma.user.create({ data: { ...base, email: email ?? `kakao_${kakaoId}@kakao.local` }, select: { id: true } })).id;
      } catch (e) {
        if (!isDuplicate(e) || !email) throw e;
        // 같은 이메일을 쓰는 회원이 이미 있으면, 임시 이메일로 가입시킵니다.
        userId = (await prisma.user.create({ data: { ...base, email: `kakao_${kakaoId}@kakao.local` }, select: { id: true } })).id;
      }
    }
    await createSession(userId, 30);
  } catch (e) {
    console.error("카카오 회원 처리 실패:", e);
    userId = null;
  }
  if (userId === null) return redirect("/login?kakao=fail");
  redirect(safeNext(flow.next));
}
