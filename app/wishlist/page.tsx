import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "관심 상품" };

export default async function Page() {
  await requireUser("/wishlist");
  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: "12px", color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>
          HOME
        </Link>
        {" "}
        &gt;
        {" "}
        <Link href="/mypage" style={{ color: "#767676" }}>
          MY PAGE
        </Link>
        {" "}
        &gt; WISHLIST
      </div>
      <section style={{ padding: "20px 60px 0" }}>
        <h1 style={{ margin: "0", font: "800 40px Archivo,sans-serif", letterSpacing: ".04em" }}>
          WISHLIST
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#555" }}>
          관심 상품
          {" "}
          <b>
            [0]
          </b>
          개
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginTop: "28px", padding: "16px 0", borderTop: "1px solid #111", borderBottom: "1px solid #e5e5e5", fontSize: "13px" }}>
          <span style={{ display: "flex", gap: "18px" }}>
            <a href="#" style={{ fontWeight: "700" }}>
              전체 선택
            </a>
            <a href="#" style={{ color: "#767676" }}>
              선택 삭제
            </a>
          </span>
          <Link href="/cart" style={{ fontWeight: "700", borderBottom: "1px solid #111" }}>
            전체 상품 장바구니 담기
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "40px 20px", marginTop: "32px" }}>
          <div className="card">
            <Link href="/product" style={{ display: "block" }}>
              <div className="ph" style={{ background: "#e6e3de" }}>
              </div>
            </Link>
            <b>
              [브랜드명]
            </b>
            <Link href="/product" style={{ display: "block", marginTop: "4px", font: "500 14px/1.4 'Noto Sans KR',sans-serif" }}>
              부클 벨티드 코트
            </Link>
            <i>
              ₩276,000
            </i>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginTop: "12px" }}>
              <Link href="/cart" style={{ textAlign: "center", padding: "12px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
                ADD TO CART
              </Link>
              <a href="#" style={{ padding: "12px 16px", border: "1px solid #ccc", fontSize: "12px", color: "#555" }}>
                삭제
              </a>
            </div>
          </div>
          <div className="card">
            <Link href="/product" style={{ display: "block" }}>
              <div className="ph" style={{ background: "#ddd8d0" }}>
              </div>
            </Link>
            <b>
              [브랜드명]
            </b>
            <Link href="/product" style={{ display: "block", marginTop: "4px", font: "500 14px/1.4 'Noto Sans KR',sans-serif" }}>
              데님 셔츠
            </Link>
            <i>
              ₩145,000
            </i>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginTop: "12px" }}>
              <Link href="/cart" style={{ textAlign: "center", padding: "12px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
                ADD TO CART
              </Link>
              <a href="#" style={{ padding: "12px 16px", border: "1px solid #ccc", fontSize: "12px", color: "#555" }}>
                삭제
              </a>
            </div>
          </div>
          <div className="card">
            <Link href="/product" style={{ display: "block" }}>
              <div className="ph" style={{ background: "#d6d6d6" }}>
              </div>
            </Link>
            <b>
              [브랜드명]
            </b>
            <Link href="/product" style={{ display: "block", marginTop: "4px", font: "500 14px/1.4 'Noto Sans KR',sans-serif" }}>
              레더 재킷
            </Link>
            <i>
              ₩194,000
            </i>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginTop: "12px" }}>
              <Link href="/cart" style={{ textAlign: "center", padding: "12px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
                ADD TO CART
              </Link>
              <a href="#" style={{ padding: "12px 16px", border: "1px solid #ccc", fontSize: "12px", color: "#555" }}>
                삭제
              </a>
            </div>
          </div>
          <div className="card">
            <Link href="/product" style={{ display: "block" }}>
              <div className="ph" style={{ background: "#dcdcdc" }}>
              </div>
            </Link>
            <b>
              [브랜드명]
            </b>
            <Link href="/product" style={{ display: "block", marginTop: "4px", font: "500 14px/1.4 'Noto Sans KR',sans-serif" }}>
              헨리넥 니트
            </Link>
            <i>
              ₩80,000
            </i>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginTop: "12px" }}>
              <Link href="/cart" style={{ textAlign: "center", padding: "12px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
                ADD TO CART
              </Link>
              <a href="#" style={{ padding: "12px 16px", border: "1px solid #ccc", fontSize: "12px", color: "#555" }}>
                삭제
              </a>
            </div>
          </div>
          <div className="card">
            <Link href="/product" style={{ display: "block" }}>
              <div className="ph" style={{ background: "#ddd8d0" }}>
              </div>
            </Link>
            <b>
              [브랜드명]
            </b>
            <Link href="/product" style={{ display: "block", marginTop: "4px", font: "500 14px/1.4 'Noto Sans KR',sans-serif" }}>
              밀리터리 셋업
            </Link>
            <i>
              ₩119,000
            </i>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginTop: "12px" }}>
              <Link href="/cart" style={{ textAlign: "center", padding: "12px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
                ADD TO CART
              </Link>
              <a href="#" style={{ padding: "12px 16px", border: "1px solid #ccc", fontSize: "12px", color: "#555" }}>
                삭제
              </a>
            </div>
          </div>
          <div className="card">
            <Link href="/product" style={{ display: "block" }}>
              <div className="ph" style={{ background: "#d6d6d6" }}>
              </div>
            </Link>
            <b>
              [브랜드명]
            </b>
            <Link href="/product" style={{ display: "block", marginTop: "4px", font: "500 14px/1.4 'Noto Sans KR',sans-serif" }}>
              와이드 팬츠
            </Link>
            <i>
              ₩101,000
            </i>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginTop: "12px" }}>
              <Link href="/cart" style={{ textAlign: "center", padding: "12px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
                ADD TO CART
              </Link>
              <a href="#" style={{ padding: "12px 16px", border: "1px solid #ccc", fontSize: "12px", color: "#555" }}>
                삭제
              </a>
            </div>
          </div>
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
