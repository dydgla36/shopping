import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Item } from "@/lib/lists";

// 메인 화면의 상품 줄: 가운데 정렬 제목 + 상품 4개 + VIEW ALL. 상품이 없으면 보이지 않습니다.
export default function HomeRow({ title, sub, href, items }: { title: string; sub?: string; href: string; items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <section className="sec">
      <div className="sh2">
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
        <Link href={href}>VIEW ALL</Link>
      </div>
      <div className="grid">
        {items.map((item) => <ProductCard key={item.id} {...item} />)}
      </div>
    </section>
  );
}
