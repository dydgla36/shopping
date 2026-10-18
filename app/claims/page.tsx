import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "취소/반품/교환" };

export default async function Page() {
  await requireUser("/claims");
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
            <Link href="/claims" style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #e5e5e5", font: "700 14px 'Noto Sans KR',sans-serif" }}>
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
            <div style={{ font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              취소 / 반품 / 교환 내역
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #111", background: "#111", color: "#fff", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                전체
              </a>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                취소
              </a>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                반품
              </a>
              <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
                교환
              </a>
            </div>
            <div style={{ marginTop: "20px", padding: "18px 20px", background: "#f4f2ee", fontSize: "13px", lineHeight: "1.8", color: "#555" }}>
              · 배송 완료 후 [N]일 이내에 신청하실 수 있어요.
              <br />
              · [취소 · 반품 · 교환 안내 문구를 입력하세요]
            </div>
            <div style={{ overflowX: "auto", marginTop: "24px" }}>
              <div style={{ minWidth: "560px", borderTop: "1px solid #111" }}>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px 100px", gap: "12px", padding: "14px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", font: "700 12px 'Noto Sans KR',sans-serif", color: "#767676" }}>
                  <span>
                    신청일
                  </span>
                  <span>
                    상품
                  </span>
                  <span>
                    유형
                  </span>
                  <span>
                    처리 상태
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px 100px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", fontSize: "14px" }}>
                  <span>
                    [YYYY.MM.DD]
                  </span>
                  <span>
                    <Link href="/order-detail">
                      [상품명]
                    </Link>
                  </span>
                  <span>
                    취소
                  </span>
                  <span>
                    처리 완료
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px 100px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", fontSize: "14px" }}>
                  <span>
                    [YYYY.MM.DD]
                  </span>
                  <span>
                    <Link href="/order-detail">
                      [상품명]
                    </Link>
                  </span>
                  <span>
                    반품
                  </span>
                  <span>
                    처리 중
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px 100px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", alignItems: "center", fontSize: "14px" }}>
                  <span>
                    [YYYY.MM.DD]
                  </span>
                  <span>
                    <Link href="/order-detail">
                      [상품명]
                    </Link>
                  </span>
                  <span>
                    교환
                  </span>
                  <span>
                    접수
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "28px" }}>
              <Link href="/mypage" style={{ display: "inline-block", padding: "14px 24px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
                주문 내역에서 신청하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
