import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export const metadata = { title: "상품 상세" };

export default function Page() {
  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: "12px", color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>
          HOME
        </Link>
        {" "}
        &gt; WOMEN &gt; 아우터
      </div>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "56px", padding: "28px 60px 0" }}>
        <div>
          <div style={{ aspectRatio: "4/5", background: "#e6e3de" }}>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginTop: "10px" }}>
            <div style={{ aspectRatio: "1", background: "#ddd8d0" }}>
            </div>
            <div style={{ aspectRatio: "1", background: "#e6e3de" }}>
            </div>
            <div style={{ aspectRatio: "1", background: "#ddd8d0" }}>
            </div>
            <div style={{ aspectRatio: "1", background: "#e6e3de" }}>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "520px" }}>
          <div style={{ font: "700 13px Archivo,sans-serif", letterSpacing: ".1em", color: "#767676" }}>
            [브랜드명]
          </div>
          <h1 style={{ margin: "10px 0 0", font: "700 28px/1.35 'Noto Sans KR',sans-serif" }}>
            부클 벨티드 코트
          </h1>
          <div style={{ marginTop: "14px", font: "800 24px Archivo,sans-serif" }}>
            ₩276,000
          </div>
          <p style={{ margin: "18px 0 0", fontSize: "14px", lineHeight: "1.8", color: "#444", paddingBottom: "24px", borderBottom: "1px solid #e5e5e5" }}>
            부드러운 부클 소재의 벨티드 코트. [상품 설명을 입력하세요]
          </p>
          <div className="lbl">
            COLOR
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#d9cfc1", border: "1px solid #ccc" }}>
            </span>
            <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#2b2b2b" }}>
            </span>
          </div>
          <div className="lbl">
            SIZE
          </div>
          <div>
            <input className="opt" type="radio" name="sz" id="s1" />
            <label htmlFor="s1">
              S
            </label>
            <input className="opt" type="radio" name="sz" id="s2" defaultChecked />
            <label htmlFor="s2">
              M
            </label>
            <input className="opt" type="radio" name="sz" id="s3" />
            <label htmlFor="s3">
              L
            </label>
          </div>
          <div className="lbl">
            QUANTITY
          </div>
          <div style={{ display: "inline-flex", border: "1px solid #ccc", font: "500 14px Archivo,sans-serif" }}>
            <span style={{ padding: "12px 18px" }}>
              −
            </span>
            <span style={{ padding: "12px 20px", fontWeight: "700" }}>
              1
            </span>
            <span style={{ padding: "12px 18px" }}>
              +
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #111", font: "700 14px 'Noto Sans KR',sans-serif" }}>
            <span>
              총 상품금액
            </span>
            <span style={{ font: "800 20px Archivo,sans-serif" }}>
              ₩276,000
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
            <Link className="btn" href="/cart" style={{ border: "1px solid #111" }}>
              ADD TO CART
            </Link>
            <Link className="btn" href="/checkout" style={{ background: "#111", color: "#fff" }}>
              BUY NOW
            </Link>
          </div>
          <div style={{ marginTop: "36px", fontSize: "13px", lineHeight: "1.9", color: "#555", borderTop: "1px solid #e5e5e5", paddingTop: "20px" }}>
            <b style={{ color: "#111" }}>
              배송 안내
            </b>
            {" "}
            [배송비·배송 기간 안내]
            <br />
            <b style={{ color: "#111" }}>
              교환·반품
            </b>
            {" "}
            [교환·반품 정책 안내]
          </div>
        </div>
      </section>
      <section style={{ padding: "96px 60px 0" }}>
        <div style={{ marginBottom: "28px", font: "800 26px Archivo,sans-serif" }}>
          YOU MAY ALSO LIKE
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "28px 20px" }}>
          <ProductCard name="데님 셔츠" price="₩145,000" bg="#e6e3de" />
          <ProductCard name="퍼 트림 후드 집업" price="₩193,000" bg="#ddd8d0" />
          <ProductCard name="밀리터리 셋업" price="₩119,000" bg="#e6e3de" />
          <ProductCard name="레이어드 니트" price="₩89,000" bg="#ddd8d0" />
        </div>
      </section>
    </>
  );
}
