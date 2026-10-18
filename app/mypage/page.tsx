import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "마이페이지" };

export default async function Page() {
  await requireUser("/mypage");
  return (
    <>
      <section style={{ padding: "56px 60px 0" }}>
        <h1 style={{ margin: "0", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>
          MY PAGE
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "48px", marginTop: "32px", alignItems: "start" }}>
          <nav style={{ borderTop: "1px solid #111", maxWidth: "240px" }}>
            <a href="#" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "700 14px 'Noto Sans KR',sans-serif" }}>
              주문 내역
            </a>
            <Link href="/claims" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              취소 / 반품 / 교환
            </Link>
            <Link href="/wishlist" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              관심 상품
            </Link>
            <Link href="/points" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              적립금
            </Link>
            <Link href="/coupons" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              쿠폰
            </Link>
            <Link href="/profile-edit" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              회원 정보 수정
            </Link>
          </nav>
          <div style={{ gridColumn: "span 2", minWidth: "0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", padding: "28px", background: "#f4f2ee" }}>
              <div>
                <div style={{ font: "700 18px 'Noto Sans KR',sans-serif" }}>
                  [이름]님, 안녕하세요
                </div>
                <div style={{ marginTop: "6px", fontSize: "13px", color: "#767676" }}>
                  회원 등급 [등급]
                </div>
              </div>
              <div style={{ display: "flex", gap: "40px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#767676" }}>
                    적립금
                  </div>
                  <div style={{ marginTop: "4px", font: "800 20px Archivo,sans-serif" }}>
                    [0]
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#767676" }}>
                    쿠폰
                  </div>
                  <div style={{ marginTop: "4px", font: "800 20px Archivo,sans-serif" }}>
                    [0]
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "40px", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              주문 처리 현황
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginTop: "14px", borderTop: "1px solid #111", borderBottom: "1px solid #e5e5e5" }}>
              <div style={{ padding: "20px 8px", textAlign: "center" }}>
                <div style={{ font: "800 24px Archivo,sans-serif" }}>
                  [0]
                </div>
                <div style={{ marginTop: "6px", fontSize: "12px", color: "#767676" }}>
                  입금 전
                </div>
              </div>
              <div style={{ padding: "20px 8px", textAlign: "center" }}>
                <div style={{ font: "800 24px Archivo,sans-serif" }}>
                  [0]
                </div>
                <div style={{ marginTop: "6px", fontSize: "12px", color: "#767676" }}>
                  배송 준비
                </div>
              </div>
              <div style={{ padding: "20px 8px", textAlign: "center" }}>
                <div style={{ font: "800 24px Archivo,sans-serif" }}>
                  [0]
                </div>
                <div style={{ marginTop: "6px", fontSize: "12px", color: "#767676" }}>
                  배송 중
                </div>
              </div>
              <div style={{ padding: "20px 8px", textAlign: "center" }}>
                <div style={{ font: "800 24px Archivo,sans-serif" }}>
                  [0]
                </div>
                <div style={{ marginTop: "6px", fontSize: "12px", color: "#767676" }}>
                  배송 완료
                </div>
              </div>
            </div>
            <div style={{ marginTop: "48px", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              최근 주문 내역
            </div>
            <div style={{ overflowX: "auto", marginTop: "14px" }}>
              <div style={{ minWidth: "560px", borderTop: "1px solid #111" }}>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 120px 96px", gap: "12px", padding: "14px 12px", borderBottom: "1px solid #e5e5e5", font: "700 12px 'Noto Sans KR',sans-serif", color: "#767676" }}>
                  <span>
                    주문일
                  </span>
                  <span>
                    상품
                  </span>
                  <span>
                    금액
                  </span>
                  <span>
                    상태
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
                  <span style={{ color: "#767676" }}>
                    [YYYY.MM.DD]
                  </span>
                  <Link href="/order-detail">
                    [상품명]
                  </Link>
                  <span style={{ fontFamily: "Archivo,sans-serif" }}>
                    [₩000,000]
                  </span>
                  <span style={{ fontWeight: "700" }}>
                    배송 완료
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
                  <span style={{ color: "#767676" }}>
                    [YYYY.MM.DD]
                  </span>
                  <Link href="/order-detail">
                    [상품명]
                  </Link>
                  <span style={{ fontFamily: "Archivo,sans-serif" }}>
                    [₩000,000]
                  </span>
                  <span style={{ fontWeight: "700" }}>
                    배송 중
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
                  <span style={{ color: "#767676" }}>
                    [YYYY.MM.DD]
                  </span>
                  <Link href="/order-detail">
                    [상품명]
                  </Link>
                  <span style={{ fontFamily: "Archivo,sans-serif" }}>
                    [₩000,000]
                  </span>
                  <span style={{ fontWeight: "700" }}>
                    배송 준비
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
