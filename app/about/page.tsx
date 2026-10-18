
export const metadata = { title: "ABOUT" };

export default function Page() {
  return (
    <>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", minHeight: "520px", marginTop: "0" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px", padding: "60px", background: "#f4f2ee" }}>
          <div style={{ font: "700 13px Archivo,sans-serif", letterSpacing: ".14em" }}>
            ABOUT GABBY
          </div>
          <h1 style={{ margin: "0", font: "800 56px/1.1 Archivo,'Noto Sans KR',sans-serif" }}>
            [브랜드 슬로건]
          </h1>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.8", color: "#444", maxWidth: "440px" }}>
            [브랜드 소개 문구를 입력하세요]
          </p>
        </div>
        <div style={{ background: "#d9d5ce", minHeight: "360px" }}>
        </div>
      </section>
      <section style={{ padding: "72px 60px 0" }}>
        <div style={{ marginBottom: "28px", font: "800 26px Archivo,sans-serif" }}>
          OUR VALUES
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px" }}>
          <div style={{ padding: "28px", background: "#f4f2ee" }}>
            <div style={{ font: "800 18px Archivo,'Noto Sans KR',sans-serif" }}>
              [가치 1]
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "14px", lineHeight: "1.8", color: "#555" }}>
              [설명을 입력하세요]
            </p>
          </div>
          <div style={{ padding: "28px", background: "#f4f2ee" }}>
            <div style={{ font: "800 18px Archivo,'Noto Sans KR',sans-serif" }}>
              [가치 2]
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "14px", lineHeight: "1.8", color: "#555" }}>
              [설명을 입력하세요]
            </p>
          </div>
          <div style={{ padding: "28px", background: "#f4f2ee" }}>
            <div style={{ font: "800 18px Archivo,'Noto Sans KR',sans-serif" }}>
              [가치 3]
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "14px", lineHeight: "1.8", color: "#555" }}>
              [설명을 입력하세요]
            </p>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ marginBottom: "12px", font: "800 26px Archivo,sans-serif" }}>
          CUSTOMER CENTER
        </div>
        <div style={{ borderTop: "1px solid #111" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "16px 0", borderBottom: "1px solid #e5e5e5", fontSize: "14px" }}>
            <span style={{ color: "#767676" }}>
              고객센터
            </span>
            <span>
              [전화번호]
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "16px 0", borderBottom: "1px solid #e5e5e5", fontSize: "14px" }}>
            <span style={{ color: "#767676" }}>
              운영시간
            </span>
            <span>
              [운영시간]
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "16px 0", borderBottom: "1px solid #e5e5e5", fontSize: "14px" }}>
            <span style={{ color: "#767676" }}>
              이메일
            </span>
            <span>
              [이메일 주소]
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "16px 0", borderBottom: "1px solid #e5e5e5", fontSize: "14px" }}>
            <span style={{ color: "#767676" }}>
              배송 · 교환 · 반품
            </span>
            <span>
              [안내 문구]
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
