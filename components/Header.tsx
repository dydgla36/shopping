import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logout } from "@/app/actions/auth";

// 왼쪽: SHOP(마우스를 올리면 카테고리가 펼쳐집니다) + 안내 메뉴 / 가운데: 로고 / 오른쪽: 회원·검색·장바구니
const shop = [
  ["WOMEN", "/list/women"],
  ["BEST", "/list/best"],
  ["NEW", "/list/new"],
];
const info = [
  ["BRAND", "/about"],
  ["NOTICE", "/notice"],
  ["Q&A", "/qna"],
  ["FAQ", "/faq"],
  ["REVIEW", "/review"],
];

export default async function Header() {
  const user = await getCurrentUser();
  // 장바구니에 담긴 상품 개수 (장바구니 테이블이 아직 없어도 헤더는 깨지지 않게 합니다)
  let cartCount = 0;
  if (user) {
    try {
      cartCount = (await prisma.cartItem.aggregate({ _sum: { quantity: true }, where: { userId: user.id } }))._sum.quantity ?? 0;
    } catch (e) {
      console.error("장바구니 개수 조회 실패:", e);
    }
  }

  return (
    <header className="hd">
      <div className="hd-in">
        <nav className="hd-nav" aria-label="주 메뉴">
          <div className="dd">
            <Link className="dd-label" href="/list/women">SHOP</Link>
            <div className="dd-menu">
              <div>
                {shop.map(([label, href]) => (
                  <Link key={href} href={href}>{label}</Link>
                ))}
              </div>
            </div>
          </div>
          {info.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>

        <Link href="/" className="hd-logo" aria-label="GABBY 홈">GABBY</Link>

        <div className="hd-util">
          {user ? (
            <>
              <span className="hd-name">{user.name}님</span>
              {user.role === "ADMIN" && <Link href="/admin">ADMIN</Link>}
              <Link href="/mypage">MY PAGE</Link>
              <form action={logout}>
                <button type="submit">LOGOUT</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">LOGIN</Link>
              <Link href="/signup">JOIN</Link>
            </>
          )}
          <Link href="/search">SEARCH</Link>
          <Link href="/cart">CART ({cartCount})</Link>
        </div>
      </div>
    </header>
  );
}
