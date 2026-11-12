"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Item } from "@/lib/lists";

const KEY = "gabby-recent";

// 최근 본 상품: 이 브라우저에 본 상품 번호를 저장해 두고, 지금 보는 상품을 뺀 최대 4개를 보여줍니다.
export default function RecentlyViewed({ currentId }: { currentId: number }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    let ids: number[] = [];
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(raw)) ids = raw.filter((n): n is number => Number.isInteger(n));
    } catch {
      ids = [];
    }
    const next = [currentId, ...ids.filter((n) => n !== currentId)].slice(0, 12);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // 저장할 수 없는 환경(사생활 보호 모드 등)은 건너뜁니다.
    }
    const others = next.filter((n) => n !== currentId).slice(0, 4);
    if (others.length === 0) return;
    fetch(`/api/products-by-ids?ids=${others.join(",")}`)
      .then((r) => r.json())
      .then((d: { items?: Item[] }) => setItems(d.items ?? []))
      .catch(() => undefined);
  }, [currentId]);

  if (items.length === 0) return null;
  return (
    <section className="sec">
      <div className="sh2"><h2>RECENTLY VIEWED</h2></div>
      <div className="grid">{items.map((i) => <ProductCard key={i.id} {...i} />)}</div>
    </section>
  );
}
