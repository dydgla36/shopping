"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["대시보드", "/admin"],
  ["주문 / 배송 관리", "/admin/orders"],
  ["회원 관리", "/admin/members"],
  ["상품 관리", "/admin/products"],
  ["후기 관리", "/admin/reviews"],
  ["문의 관리", "/admin/qna"],
  ["공지 관리", "/admin/notices"],
  ["취소·반품·교환", "/admin/claims"],
  ["쿠폰 관리", "/admin/coupons"],
  ["DB 설정", "/admin/setup"],
  ["관리자 계정", "/admin/account"],
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav style={{ borderTop: "1px solid #111", width: 200, flex: "none" }}>
      {items.map(([label, href]) => {
        const on = href === "/admin" ? path === href : path.startsWith(href);
        return (
          <Link key={href} href={href} style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: `${on ? 700 : 400} 14px 'Noto Sans KR',sans-serif`, color: on ? undefined : "#555" }}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
