import Link from "next/link";

export const metadata = { title: "장바구니" };

export default function Page() {
  return (
    <>
      <section style={{ padding: "56px 60px 0" }}>
        <h1 style={{ margin: "0", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>
          CART
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "56px", marginTop: "32px", alignItems: "start" }}>
          <div style={{ borderTop: "1px solid #111" }}>
            <div style={{ display: "grid", gridTemplateColumns: "96px 1fr auto", gap: "20px", alignItems: "center", padding: "24px 0", borderBottom: "1px solid #e5e5e5" }}>
              <Link href="/product" style={{ display: "block", width: "96px", aspectRatio: "4/5", background: "#e6e3de" }}>
              </Link>
              <div>
                <div style={{ font: "400 12px Archivo,sans-serif", color: "#767676" }}>
                  [브랜드명]
                </div>
                <Link href="/product" style={{ display: "block", marginTop: "4px", font: "500 15px/1.4 'Noto Sans KR',sans-serif" }}>
                  부클 벨티드 코트
                </Link>
                <div style={{ marginTop: "6px", fontSize: "13px", color: "#767676" }}>
                  COLOR 아이보리 / SIZE M
                </div>
                <div style={{ display: "inline-flex", marginTop: "12px", border: "1px solid #ccc", font: "500 13px Archivo,sans-serif" }}>
                  <span style={{ padding: "8px 14px" }}>
                    −
                  </span>
                  <span style={{ padding: "8px 14px", fontWeight: "700" }}>
                    1
                  </span>
                  <span style={{ padding: "8px 14px" }}>
                    +
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ font: "800 16px Archivo,sans-serif" }}>
                  ₩276,000
                </div>
                <a href="#" style={{ display: "block", marginTop: "14px", fontSize: "12px", color: "#767676" }}>
                  삭제
                </a>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "96px 1fr auto", gap: "20px", alignItems: "center", padding: "24px 0", borderBottom: "1px solid #e5e5e5" }}>
              <Link href="/product" style={{ display: "block", width: "96px", aspectRatio: "4/5", background: "#ddd8d0" }}>
              </Link>
              <div>
                <div style={{ font: "400 12px Archivo,sans-serif", color: "#767676" }}>
                  [브랜드명]
                </div>
                <Link href="/product" style={{ display: "block", marginTop: "4px", font: "500 15px/1.4 'Noto Sans KR',sans-serif" }}>
                  데님 셔츠
                </Link>
                <div style={{ marginTop: "6px", fontSize: "13px", color: "#767676" }}>
                  COLOR 인디고 / SIZE S
                </div>
                <div style={{ display: "inline-flex", marginTop: "12px", border: "1px solid #ccc", font: "500 13px Archivo,sans-serif" }}>
                  <span style={{ padding: "8px 14px" }}>
                    −
                  </span>
                  <span style={{ padding: "8px 14px", fontWeight: "700" }}>
                    1
                  </span>
                  <span style={{ padding: "8px 14px" }}>
                    +
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ font: "800 16px Archivo,sans-serif" }}>
                  ₩145,000
                </div>
                <a href="#" style={{ display: "block", marginTop: "14px", fontSize: "12px", color: "#767676" }}>
                  삭제
                </a>
              </div>
            </div>
            <Link href="/" style={{ display: "inline-block", marginTop: "24px", fontSize: "13px", borderBottom: "1px solid #111" }}>
              ← 쇼핑 계속하기
            </Link>
          </div>
          <div style={{ background: "#f4f2ee", padding: "32px", maxWidth: "460px" }}>
            <div style={{ font: "800 16px Archivo,sans-serif", letterSpacing: ".08em" }}>
              ORDER SUMMARY
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", fontSize: "14px" }}>
              <span>
                상품금액
              </span>
              <span style={{ fontFamily: "Archivo,sans-serif" }}>
                ₩421,000
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", fontSize: "14px" }}>
              <span>
                배송비
              </span>
              <span style={{ fontFamily: "Archivo,sans-serif" }}>
                [배송비]
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", fontSize: "14px" }}>
              <span>
                할인 금액
              </span>
              <span style={{ fontFamily: "Archivo,sans-serif" }}>
                ₩0
              </span>
            </div>
            <div style={{ marginTop: "22px", paddingTop: "20px", borderTop: "1px solid #111" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", fontSize: "14px", fontWeight: "700" }}>
                <span>
                  총 결제 예정금액
                </span>
                <span style={{ fontFamily: "Archivo,sans-serif" }}>
                  ₩421,000
                </span>
              </div>
            </div>
            <Link className="btn" href="/checkout" style={{ marginTop: "28px", background: "#111", color: "#fff" }}>
              ORDER
            </Link>
            <div style={{ marginTop: "14px", fontSize: "12px", color: "#767676", lineHeight: "1.7" }}>
              [적립금·쿠폰 안내 문구를 입력하세요]
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
