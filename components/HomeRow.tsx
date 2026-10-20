import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

// 메인 화면의 상품 줄. DB의 상품을 보여주고, 아직 상품이 없으면 샘플 상품을 보여줍니다.
export default async function HomeRow({ title, href, slug }: { title: string; href: string; slug: string }) {
  const items = (await getProducts(slug)).slice(0, 4);
  return (
    <section className="sec">
      <div className="sh"><h2>{title}</h2><Link href={href}>상품 더 보기</Link></div>
      <div className="grid">
        {items.map((item) => <ProductCard key={item.id ?? item.name} {...item} />)}
      </div>
    </section>
  );
}
