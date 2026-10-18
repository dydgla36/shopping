import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export const metadata = { title: "패션 쇼핑몰 홈페이지" };

export default function Page() {
  return (
    <>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", minHeight: "640px" }}>
        <div style={{ background: "#d9d5ce", minHeight: "420px" }}>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px", padding: "60px", background: "#f4f2ee" }}>
          <div style={{ font: "700 13px Archivo,sans-serif", letterSpacing: ".14em" }}>
            NEW ARRIVALS
          </div>
          <h1 style={{ margin: "0", font: "800 64px/1.05 Archivo,'Noto Sans KR',sans-serif" }}>
            감각적인 컬렉션,
            <br />
            그 이상의 완성
          </h1>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.7", color: "#444", maxWidth: "420px" }}>
            매주 업데이트되는 브랜드 아카이브. 지금 가장 많이 선택되는 아이템을 만나보세요.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/list/new" style={{ background: "#111", color: "#fff", padding: "16px 28px", font: "700 13px Archivo,sans-serif", letterSpacing: ".08em" }}>
              WOMEN'S NEW
            </Link>
            <Link href="/list/new" style={{ border: "1px solid #111", padding: "15px 28px", font: "700 13px Archivo,sans-serif", letterSpacing: ".08em" }}>
              MEN'S NEW
            </Link>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="sh">
          <h2>
            WOMEN'S NEW
          </h2>
          <Link href="/list/new">
            신규 상품 보기
          </Link>
        </div>
        <div className="grid">
          <ProductCard name="데님 셔츠" price="₩145,000" bg="#e6e3de" />
          <ProductCard name="퍼 트림 후드 집업" price="₩193,000" bg="#ddd8d0" />
          <ProductCard name="밀리터리 셋업" price="₩119,000" bg="#e6e3de" />
          <ProductCard name="부클 벨티드 코트" price="₩276,000" bg="#ddd8d0" />
        </div>
      </section>
      <section className="sec">
        <div className="sh">
          <h2>
            MEN'S NEW
          </h2>
          <Link href="/list/new">
            신규 상품 보기
          </Link>
        </div>
        <div className="grid">
          <ProductCard name="레더 재킷" price="₩194,000" bg="#d6d6d6" sale="7%" />
          <ProductCard name="헨리넥 니트" price="₩80,000" bg="#dcdcdc" sale="7%" />
          <ProductCard name="와이드 팬츠" price="₩101,000" bg="#d6d6d6" sale="7%" />
          <ProductCard name="후디드 봄버" price="₩205,000" bg="#dcdcdc" />
        </div>
      </section>
      <section className="sec">
        <div className="sh">
          <h2>
            WOMEN BEST
          </h2>
          <Link href="/list/best">
            인기 상품 보기
          </Link>
        </div>
        <div className="grid">
          <ProductCard name="스트라이프 슬리브리스 & 가디건 세트" price="₩118,000" bg="#e6e3de" />
          <ProductCard name="트림 가디건 세트" price="₩130,000" bg="#ddd8d0" />
          <ProductCard name="레이어드 니트" price="₩89,000" bg="#e6e3de" />
          <ProductCard name="오프숄더 스카프 스웨터" price="₩142,000" bg="#ddd8d0" />
        </div>
      </section>
    </>
  );
}
