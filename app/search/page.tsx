import ProductCard from "@/components/ProductCard";

export const metadata = { title: "검색" };

export default function Page() {
  return (
    <>
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 24px 0", textAlign: "center" }}>
        <h1 style={{ margin: "0", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>
          SEARCH
        </h1>
        <div style={{ display: "flex", marginTop: "28px", borderBottom: "2px solid #111" }}>
          <input type="text" aria-label="검색어" placeholder="검색어를 입력하세요" style={{ flex: "1", border: "0", padding: "16px 4px", font: "400 18px 'Noto Sans KR',sans-serif", outline: "none" }} />
          <a href="#" style={{ padding: "16px 8px", font: "700 13px Archivo,sans-serif", letterSpacing: ".08em" }}>
            SEARCH
          </a>
        </div>
        <div style={{ marginTop: "28px", font: "700 12px Archivo,sans-serif", letterSpacing: ".1em", color: "#767676" }}>
          POPULAR
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginTop: "14px" }}>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            [인기 검색어]
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            [인기 검색어]
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            [인기 검색어]
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            [인기 검색어]
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            [인기 검색어]
          </a>
        </div>
      </section>
      <section style={{ padding: "64px 60px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", padding: "16px 0", borderTop: "1px solid #111", borderBottom: "1px solid #e5e5e5", fontSize: "13px" }}>
          <span>
            [검색어] 검색 결과
            {" "}
            <b>
              [00]
            </b>
            건
          </span>
          <span style={{ display: "flex", gap: "18px" }}>
            <a href="#" style={{ fontWeight: "700" }}>
              신상품순
            </a>
            <a href="#" style={{ color: "#767676" }}>
              인기순
            </a>
            <a href="#" style={{ color: "#767676" }}>
              낮은가격순
            </a>
            <a href="#" style={{ color: "#767676" }}>
              높은가격순
            </a>
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "40px 20px", marginTop: "32px" }}>
          <ProductCard name="부클 벨티드 코트" price="₩276,000" bg="#e6e3de" />
          <ProductCard name="데님 셔츠" price="₩145,000" bg="#ddd8d0" />
          <ProductCard name="레더 재킷" price="₩194,000" bg="#d6d6d6" />
          <ProductCard name="헨리넥 니트" price="₩80,000" bg="#dcdcdc" />
          <ProductCard name="밀리터리 셋업" price="₩119,000" bg="#ddd8d0" />
          <ProductCard name="와이드 팬츠" price="₩101,000" bg="#d6d6d6" />
          <ProductCard name="레이어드 니트" price="₩89,000" bg="#e6e3de" />
          <ProductCard name="후드 집업" price="₩193,000" bg="#ddd8d0" />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "56px" }}>
          <a href="#" style={{ minWidth: "40px", padding: "10px 0", textAlign: "center", font: "700 14px Archivo,sans-serif", borderBottom: "2px solid #111" }}>
            1
          </a>
          <a href="#" style={{ minWidth: "40px", padding: "10px 0", textAlign: "center", font: "700 14px Archivo,sans-serif", color: "#767676" }}>
            2
          </a>
          <a href="#" style={{ minWidth: "40px", padding: "10px 0", textAlign: "center", font: "700 14px Archivo,sans-serif", color: "#767676" }}>
            3
          </a>
          <a href="#" style={{ minWidth: "40px", padding: "10px 0", textAlign: "center", font: "700 14px Archivo,sans-serif", color: "#767676" }}>
            4
          </a>
          <a href="#" style={{ minWidth: "40px", padding: "10px 0", textAlign: "center", font: "700 14px Archivo,sans-serif", color: "#767676" }}>
            →
          </a>
        </div>
      </section>
    </>
  );
}
