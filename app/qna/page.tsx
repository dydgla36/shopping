import Link from "next/link";

export const metadata = { title: "Q&A" };

export default function Page() {
  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: "12px", color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>
          HOME
        </Link>
        {" "}
        &gt; Q&amp;A
      </div>
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px 24px 0" }}>
        <h1 style={{ margin: "0", font: "800 40px Archivo,sans-serif", letterSpacing: ".04em" }}>
          Q&amp;A
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#555" }}>
          궁금한 점을 남겨주세요
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "28px" }}>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #111", background: "#111", color: "#fff", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            전체
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            상품 문의
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            배송 문의
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            교환 / 반품
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            기타
          </a>
        </div>
        <div style={{ overflowX: "auto", marginTop: "28px" }}>
          <div style={{ minWidth: "640px", borderTop: "1px solid #111" }}>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 120px 96px", gap: "12px", padding: "14px 12px", borderBottom: "1px solid #e5e5e5", font: "700 12px 'Noto Sans KR',sans-serif", color: "#767676" }}>
              <span>
                번호
              </span>
              <span>
                제목
              </span>
              <span>
                작성자
              </span>
              <span>
                작성일
              </span>
              <span>
                상태
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                8
              </span>
              <a href="#">
                [문의 제목]
                {" "}
                <span style={{ fontSize: "12px", color: "#767676" }}>
                  [비밀글]
                </span>
              </a>
              <span style={{ color: "#555" }}>
                [작성자]
              </span>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ fontWeight: "700", color: "#111" }}>
                답변완료
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                7
              </span>
              <a href="#">
                [문의 제목]
                {" "}
                <span style={{ fontSize: "12px", color: "#767676" }}>
                  [비밀글]
                </span>
              </a>
              <span style={{ color: "#555" }}>
                [작성자]
              </span>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ fontWeight: "700", color: "#767676" }}>
                답변대기
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                6
              </span>
              <a href="#">
                [문의 제목]
              </a>
              <span style={{ color: "#555" }}>
                [작성자]
              </span>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ fontWeight: "700", color: "#111" }}>
                답변완료
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                5
              </span>
              <a href="#">
                [문의 제목]
                {" "}
                <span style={{ fontSize: "12px", color: "#767676" }}>
                  [비밀글]
                </span>
              </a>
              <span style={{ color: "#555" }}>
                [작성자]
              </span>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ fontWeight: "700", color: "#111" }}>
                답변완료
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                4
              </span>
              <a href="#">
                [문의 제목]
              </a>
              <span style={{ color: "#555" }}>
                [작성자]
              </span>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ fontWeight: "700", color: "#111" }}>
                답변완료
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                3
              </span>
              <a href="#">
                [문의 제목]
                {" "}
                <span style={{ fontSize: "12px", color: "#767676" }}>
                  [비밀글]
                </span>
              </a>
              <span style={{ color: "#555" }}>
                [작성자]
              </span>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ fontWeight: "700", color: "#767676" }}>
                답변대기
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                2
              </span>
              <a href="#">
                [문의 제목]
                {" "}
                <span style={{ fontSize: "12px", color: "#767676" }}>
                  [비밀글]
                </span>
              </a>
              <span style={{ color: "#555" }}>
                [작성자]
              </span>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ fontWeight: "700", color: "#111" }}>
                답변완료
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 120px 120px 96px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                1
              </span>
              <a href="#">
                [문의 제목]
              </a>
              <span style={{ color: "#555" }}>
                [작성자]
              </span>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ fontWeight: "700", color: "#111" }}>
                답변완료
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "28px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" aria-label="Q&A 검색" placeholder="제목, 작성자 검색" style={{ padding: "12px 14px", border: "1px solid #ccc", font: "400 13px 'Noto Sans KR',sans-serif", width: "220px" }} />
            <a href="#" style={{ padding: "12px 20px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
              SEARCH
            </a>
          </div>
          <Link href="/qna/write" style={{ background: "#111", color: "#fff", padding: "12px 24px", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
            WRITE
          </Link>
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
