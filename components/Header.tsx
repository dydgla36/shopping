import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logout } from "@/app/actions/auth";

const nav = [
  ["BEST", "/list/best"],
  ["NEW 7%", "/list/new"],
  ["MEN", "/list/men"],
  ["WOMEN", "/list/women"],
  ["ABOUT", "/about"],
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
  const util = [
    ["REVIEW", "/review"],
    ["Q&A", "/qna"],
    ["NOTICE", "/notice"],
    ["SEARCH", "/search"],
    ...(user?.role === "ADMIN" ? [["ADMIN", "/admin"]] : []),
    ...(user ? [] : [["LOGIN", "/login"]]),
    ["MY PAGE", "/mypage"],
    [`CART (${cartCount})`, "/cart"],
  ];

  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, padding: "22px 60px", borderBottom: "1px solid #e5e5e5" }}>
      <Link href="/" style={{ font: "800 32px/1 Archivo,sans-serif", letterSpacing: ".08em" }}>GABBY</Link>
      <nav className="nav" style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
        {nav.map(([label, href]) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </nav>
      <div className="nav" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 22 }}>
        {user && <span style={{ font: "500 13px 'Noto Sans KR',sans-serif" }}>{user.name}님</span>}
        {util.map(([label, href]) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
        {user && (
          <form action={logout}>
            <button type="submit">LOGOUT</button>
          </form>
        )}
      </div>
    </header>
  );
}
