import Link from "next/link";
import { chip } from "@/lib/ui";

// 페이지 번호. base는 기본 주소(예: /review), params는 함께 유지할 검색 조건입니다.
export default function Pager({ page, pages, base, params = {} }: { page: number; pages: number; base: string; params?: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && q.set(k, v));
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return s ? `${base}?${s}` : base;
  };
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 48, flexWrap: "wrap" }}>
      {page > 1 && <Link href={href(page - 1)} style={chip(false)}>이전</Link>}
      {nums.map((n) => <Link key={n} href={href(n)} style={chip(n === page)}>{n}</Link>)}
      {page < pages && <Link href={href(page + 1)} style={chip(false)}>다음</Link>}
    </div>
  );
}
