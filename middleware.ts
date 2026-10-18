import { NextResponse, type NextRequest } from "next/server";

// 로그인이 필요한 주소. 목록에 주소를 추가하면 보호 대상이 늘어납니다.
// (장바구니는 로그인 없이 볼 수 있고, 결제 단계부터 로그인이 필요합니다.)
const PROTECTED = [
  "/mypage", "/claims", "/points", "/coupons", "/wishlist", "/profile-edit",
  "/order-detail", "/order-complete", "/checkout", "/review/write", "/qna/write", "/admin",
];

// 1차 확인: 로그인 쿠키가 아예 없으면 바로 로그인 화면으로 보냅니다.
// 쿠키가 진짜인지(DB의 세션과 일치하는지)는 각 페이지의 requireUser()가 한 번 더 확인합니다.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsLogin = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (needsLogin && !req.cookies.get("session")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
