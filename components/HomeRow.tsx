import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getListProducts } from "@/lib/products";

// 메인 화면의 상품 줄 (최근 등록한 상품 4개). 상품이 없으면 보이지 않습니다.
export default async function HomeRow({ title, href, slug }: { title: string; href: string; slug: string }) {
  const { items } = await getListProducts(slug, { perPage: 4 });
  if (items.length === 0) return null;
  return (
    <section className="sec">
      <div className="sh"><h2>{title}</h2><Link href={href}>상품 더 보기</Link></div>
      <div className="grid">
        {items.map((item) => <ProductCard key={item.id} {...item} />)}
      </div>
    </section>
  );
}
