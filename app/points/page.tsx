import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "적립금" };

export default async function Page() {
  await requireUser("/points");
  return (
    <>
      <section style={{ padding: "56px 60px 0" }}>
        <h1 style={{ margin: "0", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>
          MY PAGE
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "48px", marginTop: "32px", alignItems: "start" }}>
          <nav style={{ borderTop: "1px solid #111", maxWidth: "240px" }}>
            <Link href="/mypage" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              주문 내역
            </Link>
            <Link href="/claims" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              취소 / 반품 / 교환
            </Link>
            <Link href="/wishlist" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              관심 상품
            </Link>
            <Link href="/points" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "700 14px 'Noto Sans KR',sans-serif" }}>
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
            <div style={{ font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              적립금
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "20px", padding: "28px", background: "#f4f2ee" }}>
              <div style={{ flex: "1", minWidth: "140px" }}>
                <div style={{ fontSize: "12px", color: "#767676" }}>
                  사용 가능 적립금
                </div>
                <div style={{ marginTop: "6px", font: "800 22px Archivo,sans-serif" }}>
                  [0]
                </div>
              </div>
              <div style={{ flex: "1", minWidth: "140px" }}>
                <div style={{ fontSize: "12px", color: "#767676" }}>
                  이번 달 소멸 예정
                </div>
                <div style={{ marginTop: "6px", font: "800 22px Archivo,sans-serif" }}>
                  [0]
                </div>
              </div>
              <div style={{ flex: "1", minWidth: "140px" }}>
                <div style={{ fontSize: "12px", color: "#767676" }}>
                  총 적립금
                </div>
                <div style={{ marginTop: "6px", font: "800 22px Archivo,sans-serif" }}>
                  [0]
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #111", background: "#111", color: "#fff", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                전체
              </a>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                적립
              </a>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                사용
              </a>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                소멸
              </a>
            </div>
            <div style={{ overflowX: "auto", marginTop: "24px" }}>
              <div style={{ minWidth: "560px", borderTop: "1px solid #111" }}>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 120px 120px", gap: "12px", padding: "14px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", font: "700 12px 'Noto Sans KR',sans-serif", color: "#767676" }}>
                  <span>
                    일자
                  </span>
                  <span>
                    내용
                  </span>
                  <span>
                    적립 / 사용
                  </span>
                  <span>
                    잔액
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 120px 120px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", fontSize: "14px" }}>
                  <span>
                    [YYYY.MM.DD]
                  </span>
                  <span>
                    [적립 내용]
                  </span>
                  <span>
                    + [0]
                  </span>
                  <span>
                    [0]
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 120px 120px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", fontSize: "14px" }}>
                  <span>
                    [YYYY.MM.DD]
                  </span>
                  <span>
                    [사용 내용]
                  </span>
                  <span>
                    − [0]
                  </span>
                  <span>
                    [0]
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 120px 120px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", fontSize: "14px" }}>
                  <span>
                    [YYYY.MM.DD]
                  </span>
                  <span>
                    [적립 내용]
                  </span>
                  <span>
                    + [0]
                  </span>
                  <span>
                    [0]
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 120px 120px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", fontSize: "14px" }}>
                  <span>
                    [YYYY.MM.DD]
                  </span>
                  <span>
                    [소멸 내용]
                  </span>
                  <span>
                    − [0]
                  </span>
                  <span>
                    [0]
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "20px", padding: "18px 20px", background: "#f4f2ee", fontSize: "13px", lineHeight: "1.8", color: "#555" }}>
              · [적립금 사용 · 소멸 기준 안내 문구를 입력하세요]
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
