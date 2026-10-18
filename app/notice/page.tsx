import Link from "next/link";

export const metadata = { title: "공지사항" };

export default function Page() {
  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: "12px", color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>
          HOME
        </Link>
        {" "}
        &gt; NOTICE
      </div>
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px 24px 0" }}>
        <h1 style={{ margin: "0", font: "800 40px Archivo,sans-serif", letterSpacing: ".04em" }}>
          NOTICE
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#555" }}>
          공지사항
        </p>
        <div style={{ overflowX: "auto", marginTop: "32px" }}>
          <div style={{ minWidth: "560px", borderTop: "1px solid #111" }}>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "14px 12px", borderBottom: "1px solid #e5e5e5", font: "700 12px 'Noto Sans KR',sans-serif", color: "#767676" }}>
              <span>
                번호
              </span>
              <span>
                제목
              </span>
              <span>
                작성일
              </span>
              <span style={{ textAlign: "right" }}>
                조회
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center", background: "#f7f6f3" }}>
              <span style={{ font: "700 12px Archivo,sans-serif", letterSpacing: ".06em" }}>
                NOTICE
              </span>
              <a href="#" style={{ fontWeight: "700" }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center", background: "#f7f6f3" }}>
              <span style={{ font: "700 12px Archivo,sans-serif", letterSpacing: ".06em" }}>
                NOTICE
              </span>
              <a href="#" style={{ fontWeight: "700" }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                8
              </span>
              <a href="#" style={{  }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                7
              </span>
              <a href="#" style={{  }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                6
              </span>
              <a href="#" style={{  }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                5
              </span>
              <a href="#" style={{  }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                4
              </span>
              <a href="#" style={{  }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                3
              </span>
              <a href="#" style={{  }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                2
              </span>
              <a href="#" style={{  }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 120px 72px", gap: "12px", padding: "18px 12px", borderBottom: "1px solid #e5e5e5", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "#767676", fontFamily: "Archivo,sans-serif" }}>
                1
              </span>
              <a href="#" style={{  }}>
                [공지 제목]
              </a>
              <span style={{ color: "#767676" }}>
                [YYYY.MM.DD]
              </span>
              <span style={{ color: "#767676", textAlign: "right" }}>
                [000]
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "28px" }}>
          <input type="text" aria-label="공지 검색" placeholder="제목 검색" style={{ padding: "12px 14px", border: "1px solid #ccc", font: "400 13px 'Noto Sans KR',sans-serif", width: "220px" }} />
          <a href="#" style={{ padding: "12px 20px", border: "1px solid #111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
            SEARCH
          </a>
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
