import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "주문/결제" };

export default async function Page() {
  await requireUser("/checkout");
  return (
    <>
      <section style={{ padding: "56px 60px 0" }}>
        <h1 style={{ margin: "0", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>
          ORDER
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "56px", marginTop: "8px", alignItems: "start" }}>
          <div>
            <div style={{ marginTop: "44px", paddingBottom: "14px", borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              주문자 정보
            </div>
            <label className="fld">
              이름
              <input type="text" placeholder="이름을 입력하세요" />
            </label>
            <label className="fld">
              휴대전화
              <input type="tel" placeholder="010-0000-0000" />
            </label>
            <label className="fld">
              이메일
              <input type="email" placeholder="example@email.com" />
            </label>
            <div style={{ marginTop: "44px", paddingBottom: "14px", borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              배송 정보
            </div>
            <label className="fld">
              수령인
              <input type="text" placeholder="수령인 이름" />
            </label>
            <label className="fld">
              연락처
              <input type="tel" placeholder="010-0000-0000" />
            </label>
            <label className="fld">
              주소
              <input type="text" placeholder="우편번호 검색" />
            </label>
            <label className="fld" style={{ marginTop: "10px" }}>
              <input type="text" aria-label="상세주소" placeholder="상세주소를 입력하세요" />
            </label>
            <label className="fld">
              배송 메모
              <input type="text" placeholder="[배송 메모를 입력하세요]" />
            </label>
            <div style={{ marginTop: "44px", paddingBottom: "14px", borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              결제 수단
            </div>
            <div style={{ marginTop: "20px" }}>
              <input className="opt" type="radio" name="pay" id="p1" defaultChecked="" />
              <label htmlFor="p1">
                신용카드
              </label>
              <input className="opt" type="radio" name="pay" id="p2" />
              <label htmlFor="p2">
                계좌이체
              </label>
              <input className="opt" type="radio" name="pay" id="p3" />
              <label htmlFor="p3">
                무통장입금
              </label>
              <input className="opt" type="radio" name="pay" id="p4" />
              <label htmlFor="p4">
                카카오페이
              </label>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "32px", fontSize: "13px", color: "#333" }}>
              <input type="checkbox" />
              {" "}
              주문 내용을 확인했으며 결제에 동의합니다
            </label>
          </div>
          <div style={{ background: "#f4f2ee", padding: "32px", maxWidth: "460px" }}>
            <div style={{ font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
              ORDER SUMMARY
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: "14px", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #e5e5e5" }}>
              <div style={{ aspectRatio: "4/5", background: "#e6e3de" }}>
              </div>
              <div>
                <div style={{ fontSize: "14px" }}>
                  부클 벨티드 코트
                </div>
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#767676" }}>
                  아이보리 / M / 수량 1
                </div>
              </div>
              <div style={{ font: "800 14px Archivo,sans-serif" }}>
                ₩276,000
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: "14px", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #e5e5e5" }}>
              <div style={{ aspectRatio: "4/5", background: "#ddd8d0" }}>
              </div>
              <div>
                <div style={{ fontSize: "14px" }}>
                  데님 셔츠
                </div>
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#767676" }}>
                  인디고 / S / 수량 1
                </div>
              </div>
              <div style={{ font: "800 14px Archivo,sans-serif" }}>
                ₩145,000
              </div>
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
                  총 결제금액
                </span>
                <span style={{ fontFamily: "Archivo,sans-serif" }}>
                  ₩421,000
                </span>
              </div>
            </div>
            <Link className="btn" href="/order-complete" style={{ marginTop: "28px", background: "#111", color: "#fff" }}>
              PAY ₩421,000
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
