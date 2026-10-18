import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "주문 완료" };

export default async function Page() {
  await requireUser("/order-complete");
  return (
    <>
      <section style={{ maxWidth: "560px", margin: "0 auto", padding: "80px 24px 0", textAlign: "center" }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="30" stroke="#111" strokeWidth="2">
          </circle>
          <path d="M19 33l9 9 17-19" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          </path>
        </svg>
        <h1 style={{ margin: "24px 0 0", font: "800 30px Archivo,'Noto Sans KR',sans-serif" }}>
          주문이 완료되었습니다
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: "14px", color: "#555", lineHeight: "1.7" }}>
          주문번호
          {" "}
          <b>
            [주문번호]
          </b>
          <br />
          주문 내역은 마이페이지에서 확인하실 수 있어요.
        </p>
        <div style={{ marginTop: "40px", textAlign: "left", borderTop: "1px solid #111" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: "14px" }}>
            <span style={{ color: "#767676" }}>
              주문 상품
            </span>
            <span>
              [상품명] 외 [0]건
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: "14px" }}>
            <span style={{ color: "#767676" }}>
              결제 수단
            </span>
            <span>
              [결제 수단]
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: "14px" }}>
            <span style={{ color: "#767676" }}>
              배송지
            </span>
            <span>
              [배송지 주소]
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: "14px" }}>
            <span style={{ color: "#767676" }}>
              결제 금액
            </span>
            <span>
              <b style={{ fontFamily: "Archivo,sans-serif" }}>
                ₩421,000
              </b>
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "36px" }}>
          <Link className="btn" href="/mypage" style={{ border: "1px solid #111" }}>
            ORDER HISTORY
          </Link>
          <Link className="btn" href="/" style={{ background: "#111", color: "#fff" }}>
            CONTINUE SHOPPING
          </Link>
        </div>
      </section>
    </>
  );
}
