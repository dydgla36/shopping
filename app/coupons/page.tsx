import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "쿠폰" };

export default async function Page() {
  await requireUser("/coupons");
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
            <Link href="/points" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              적립금
            </Link>
            <Link href="/coupons" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "700 14px 'Noto Sans KR',sans-serif" }}>
              쿠폰
            </Link>
            <Link href="/profile-edit" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "400 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              회원 정보 수정
            </Link>
          </nav>
          <div style={{ gridColumn: "span 2", minWidth: "0" }}>
            <div style={{ font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              쿠폰
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "20px", padding: "28px", background: "#f4f2ee" }}>
              <div style={{ flex: "1", minWidth: "140px" }}>
                <div style={{ fontSize: "12px", color: "#767676" }}>
                  사용 가능 쿠폰
                </div>
                <div style={{ marginTop: "6px", font: "800 22px Archivo,sans-serif" }}>
                  [0]장
                </div>
              </div>
              <div style={{ flex: "1", minWidth: "140px" }}>
                <div style={{ fontSize: "12px", color: "#767676" }}>
                  사용 완료 · 만료
                </div>
                <div style={{ marginTop: "6px", font: "800 22px Archivo,sans-serif" }}>
                  [0]장
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
              <input type="text" aria-label="쿠폰 번호" placeholder="쿠폰 번호를 입력하세요" style={{ flex: "1", minWidth: "200px", padding: "14px", border: "1px solid #ccc", font: "400 14px 'Noto Sans KR',sans-serif" }} />
              <a href="#" style={{ padding: "14px 24px", background: "#111", color: "#fff", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
                REGISTER
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #111", background: "#111", color: "#fff", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                사용 가능
              </a>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                사용 완료 · 만료
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px", marginTop: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", border: "1px solid #ddd" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#fff", font: "800 22px Archivo,sans-serif", padding: "20px 8px", textAlign: "center" }}>
                  [00%]
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ font: "500 15px 'Noto Sans KR',sans-serif" }}>
                    [쿠폰명]
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "12px", lineHeight: "1.7", color: "#767676" }}>
                    [최소 주문 금액] 이상 구매 시
                    <br />
                    [YYYY.MM.DD] ~ [YYYY.MM.DD]
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", border: "1px solid #ddd" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#fff", font: "800 22px Archivo,sans-serif", padding: "20px 8px", textAlign: "center" }}>
                  [00%]
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ font: "500 15px 'Noto Sans KR',sans-serif" }}>
                    [쿠폰명]
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "12px", lineHeight: "1.7", color: "#767676" }}>
                    [최소 주문 금액] 이상 구매 시
                    <br />
                    [YYYY.MM.DD] ~ [YYYY.MM.DD]
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", border: "1px solid #ddd" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#fff", font: "800 22px Archivo,sans-serif", padding: "20px 8px", textAlign: "center" }}>
                  [00%]
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ font: "500 15px 'Noto Sans KR',sans-serif" }}>
                    [쿠폰명]
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "12px", lineHeight: "1.7", color: "#767676" }}>
                    [최소 주문 금액] 이상 구매 시
                    <br />
                    [YYYY.MM.DD] ~ [YYYY.MM.DD]
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", border: "1px solid #ddd" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#fff", font: "800 22px Archivo,sans-serif", padding: "20px 8px", textAlign: "center" }}>
                  [00%]
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ font: "500 15px 'Noto Sans KR',sans-serif" }}>
                    [쿠폰명]
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "12px", lineHeight: "1.7", color: "#767676" }}>
                    [최소 주문 금액] 이상 구매 시
                    <br />
                    [YYYY.MM.DD] ~ [YYYY.MM.DD]
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "20px", padding: "18px 20px", background: "#f4f2ee", fontSize: "13px", lineHeight: "1.8", color: "#555" }}>
              · [쿠폰 사용 안내 문구를 입력하세요]
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
