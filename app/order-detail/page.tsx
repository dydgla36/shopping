import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "주문 상세" };

export default async function Page() {
  await requireUser("/order-detail");
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
        &gt; 주문 상세
      </div>
      <section style={{ padding: "20px 60px 0" }}>
        <h1 style={{ margin: "0", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>
          ORDER DETAIL
        </h1>
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", marginTop: "24px", padding: "24px", background: "#f4f2ee", fontSize: "14px" }}>
          <div>
            <span style={{ color: "#767676" }}>
              주문번호
            </span>
            {" "}
            <b>
              [주문번호]
            </b>
          </div>
          <div>
            <span style={{ color: "#767676" }}>
              주문일
            </span>
            {" "}
            <b>
              [YYYY.MM.DD]
            </b>
          </div>
          <div>
            <span style={{ color: "#767676" }}>
              주문 상태
            </span>
            {" "}
            <b>
              [주문 상태]
            </b>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "56px", alignItems: "start" }}>
          <div>
            <div style={{ marginTop: "44px", paddingBottom: "14px", borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              주문 상품
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "18px", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #e5e5e5" }}>
              <Link href="/product" style={{ display: "block", aspectRatio: "4/5", background: "#e6e3de" }}>
              </Link>
              <div>
                <div style={{ font: "400 12px Archivo,sans-serif", color: "#767676" }}>
                  [브랜드명]
                </div>
                <Link href="/product" style={{ display: "block", marginTop: "4px", fontSize: "14px" }}>
                  [상품명]
                </Link>
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#767676" }}>
                  [색상] / [사이즈] / 수량 1
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <Link href="/review/write" style={{ padding: "8px 14px", border: "1px solid #111", fontSize: "12px" }}>
                    후기 작성
                  </Link>
                  <Link href="/qna/write" style={{ padding: "8px 14px", border: "1px solid #ccc", fontSize: "12px", color: "#555" }}>
                    상품 문의
                  </Link>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ font: "800 14px Archivo,sans-serif" }}>
                  [₩000,000]
                </div>
                <div style={{ marginTop: "8px", font: "700 12px 'Noto Sans KR',sans-serif" }}>
                  [주문 상태]
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "18px", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #e5e5e5" }}>
              <Link href="/product" style={{ display: "block", aspectRatio: "4/5", background: "#ddd8d0" }}>
              </Link>
              <div>
                <div style={{ font: "400 12px Archivo,sans-serif", color: "#767676" }}>
                  [브랜드명]
                </div>
                <Link href="/product" style={{ display: "block", marginTop: "4px", fontSize: "14px" }}>
                  [상품명]
                </Link>
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#767676" }}>
                  [색상] / [사이즈] / 수량 1
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <Link href="/review/write" style={{ padding: "8px 14px", border: "1px solid #111", fontSize: "12px" }}>
                    후기 작성
                  </Link>
                  <Link href="/qna/write" style={{ padding: "8px 14px", border: "1px solid #ccc", fontSize: "12px", color: "#555" }}>
                    상품 문의
                  </Link>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ font: "800 14px Archivo,sans-serif" }}>
                  [₩000,000]
                </div>
                <div style={{ marginTop: "8px", font: "700 12px 'Noto Sans KR',sans-serif" }}>
                  [주문 상태]
                </div>
              </div>
            </div>
            <div style={{ marginTop: "44px", paddingBottom: "14px", borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              배송 정보
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "14px", fontSize: "14px" }}>
              <span style={{ color: "#767676" }}>
                수령인
              </span>
              <span>
                [수령인]
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "14px", fontSize: "14px" }}>
              <span style={{ color: "#767676" }}>
                연락처
              </span>
              <span>
                [연락처]
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "14px", fontSize: "14px" }}>
              <span style={{ color: "#767676" }}>
                배송지
              </span>
              <span>
                [배송지 주소]
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "14px", fontSize: "14px" }}>
              <span style={{ color: "#767676" }}>
                배송 메모
              </span>
              <span>
                [배송 메모]
              </span>
            </div>
          </div>
          <div style={{ maxWidth: "460px" }}>
            <div style={{ marginTop: "44px", paddingBottom: "14px", borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              결제 정보
            </div>
            <div style={{ background: "#f4f2ee", padding: "28px", marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "14px", fontSize: "14px" }}>
                <span style={{ color: "#767676" }}>
                  상품금액
                </span>
                <span>
                  [₩000,000]
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "14px", fontSize: "14px" }}>
                <span style={{ color: "#767676" }}>
                  배송비
                </span>
                <span>
                  [배송비]
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "14px", fontSize: "14px" }}>
                <span style={{ color: "#767676" }}>
                  할인 금액
                </span>
                <span>
                  [₩0]
                </span>
              </div>
              <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1px solid #111" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "14px", fontSize: "14px", fontWeight: "700" }}>
                  <span style={{ color: "#111" }}>
                    총 결제금액
                  </span>
                  <span>
                    ₩421,000
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "14px", fontSize: "14px" }}>
                <span style={{ color: "#767676" }}>
                  결제 수단
                </span>
                <span>
                  [결제 수단]
                </span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "24px" }}>
              <a className="btn" href="#" style={{ border: "1px solid #111" }}>
                CANCEL ORDER
              </a>
              <Link className="btn" href="/mypage" style={{ background: "#111", color: "#fff" }}>
                ORDER LIST
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
