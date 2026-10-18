import Link from "next/link";

export const metadata = { title: "리뷰" };

export default function Page() {
  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: "12px", color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>
          HOME
        </Link>
        {" "}
        &gt; REVIEW
      </div>
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "20px 24px 0" }}>
        <h1 style={{ margin: "0", font: "800 40px Archivo,sans-serif", letterSpacing: ".04em" }}>
          REVIEW
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#555" }}>
          구매 후기 보기
        </p>
        <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", marginTop: "28px", padding: "28px", background: "#f4f2ee" }}>
          <div>
            <div style={{ font: "700 12px Archivo,sans-serif", letterSpacing: ".1em", color: "#767676" }}>
              평균 평점
            </div>
            <div style={{ marginTop: "6px", font: "800 32px Archivo,sans-serif" }}>
              [0.0]
              {" "}
              <span style={{ fontSize: "16px", color: "#767676" }}>
                / 5
              </span>
            </div>
          </div>
          <div>
            <div style={{ font: "700 12px Archivo,sans-serif", letterSpacing: ".1em", color: "#767676" }}>
              전체 후기
            </div>
            <div style={{ marginTop: "6px", font: "800 32px Archivo,sans-serif" }}>
              [000]
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "28px" }}>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #111", background: "#111", color: "#fff", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            전체
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            포토 후기
          </a>
          <a href="#" style={{ padding: "10px 18px", border: "1px solid #ccc", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            텍스트 후기
          </a>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "28px", padding: "16px 0", borderTop: "1px solid #111", borderBottom: "1px solid #e5e5e5", fontSize: "13px" }}>
          <span style={{ display: "flex", gap: "18px" }}>
            <a href="#" style={{ fontWeight: "700" }}>
              최신순
            </a>
            <a href="#" style={{ color: "#767676" }}>
              평점 높은순
            </a>
            <a href="#" style={{ color: "#767676" }}>
              평점 낮은순
            </a>
          </span>
          <Link href="/review/write" style={{ background: "#111", color: "#fff", padding: "10px 20px", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em" }}>
            WRITE
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "24px", padding: "28px 0", borderBottom: "1px solid #e5e5e5" }}>
          <div style={{ aspectRatio: "4/5", background: "#e6e3de" }}>
          </div>
          <div>
            <div style={{ font: "700 15px Archivo,sans-serif", letterSpacing: ".1em", color: "#111" }} aria-label="별점 [0]점">
              ★★★★★
            </div>
            <Link href="/product" style={{ display: "block", marginTop: "8px", font: "500 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              [상품명]
            </Link>
            <div style={{ marginTop: "2px", fontSize: "12px", color: "#767676" }}>
              COLOR [색상] / SIZE [사이즈]
            </div>
            <p style={{ margin: "14px 0 0", fontSize: "14px", lineHeight: "1.8", color: "#222" }}>
              [후기 내용을 입력하세요]
            </p>
            <div style={{ marginTop: "14px", fontSize: "12px", color: "#767676" }}>
              [닉네임] · [YYYY.MM.DD]
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "24px", padding: "28px 0", borderBottom: "1px solid #e5e5e5" }}>
          <div style={{ aspectRatio: "4/5", background: "#ddd8d0" }}>
          </div>
          <div>
            <div style={{ font: "700 15px Archivo,sans-serif", letterSpacing: ".1em", color: "#111" }} aria-label="별점 [0]점">
              ★★★★★
            </div>
            <Link href="/product" style={{ display: "block", marginTop: "8px", font: "500 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              [상품명]
            </Link>
            <div style={{ marginTop: "2px", fontSize: "12px", color: "#767676" }}>
              COLOR [색상] / SIZE [사이즈]
            </div>
            <p style={{ margin: "14px 0 0", fontSize: "14px", lineHeight: "1.8", color: "#222" }}>
              [후기 내용을 입력하세요]
            </p>
            <div style={{ marginTop: "14px", fontSize: "12px", color: "#767676" }}>
              [닉네임] · [YYYY.MM.DD]
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "24px", padding: "28px 0", borderBottom: "1px solid #e5e5e5" }}>
          <div style={{ aspectRatio: "4/5", background: "#e6e3de" }}>
          </div>
          <div>
            <div style={{ font: "700 15px Archivo,sans-serif", letterSpacing: ".1em", color: "#111" }} aria-label="별점 [0]점">
              ★★★★★
            </div>
            <Link href="/product" style={{ display: "block", marginTop: "8px", font: "500 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              [상품명]
            </Link>
            <div style={{ marginTop: "2px", fontSize: "12px", color: "#767676" }}>
              COLOR [색상] / SIZE [사이즈]
            </div>
            <p style={{ margin: "14px 0 0", fontSize: "14px", lineHeight: "1.8", color: "#222" }}>
              [후기 내용을 입력하세요]
            </p>
            <div style={{ marginTop: "14px", fontSize: "12px", color: "#767676" }}>
              [닉네임] · [YYYY.MM.DD]
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "24px", padding: "28px 0", borderBottom: "1px solid #e5e5e5" }}>
          <div style={{ aspectRatio: "4/5", background: "#ddd8d0" }}>
          </div>
          <div>
            <div style={{ font: "700 15px Archivo,sans-serif", letterSpacing: ".1em", color: "#111" }} aria-label="별점 [0]점">
              ★★★★★
            </div>
            <Link href="/product" style={{ display: "block", marginTop: "8px", font: "500 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              [상품명]
            </Link>
            <div style={{ marginTop: "2px", fontSize: "12px", color: "#767676" }}>
              COLOR [색상] / SIZE [사이즈]
            </div>
            <p style={{ margin: "14px 0 0", fontSize: "14px", lineHeight: "1.8", color: "#222" }}>
              [후기 내용을 입력하세요]
            </p>
            <div style={{ marginTop: "14px", fontSize: "12px", color: "#767676" }}>
              [닉네임] · [YYYY.MM.DD]
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "24px", padding: "28px 0", borderBottom: "1px solid #e5e5e5" }}>
          <div style={{ aspectRatio: "4/5", background: "#e6e3de" }}>
          </div>
          <div>
            <div style={{ font: "700 15px Archivo,sans-serif", letterSpacing: ".1em", color: "#111" }} aria-label="별점 [0]점">
              ★★★★★
            </div>
            <Link href="/product" style={{ display: "block", marginTop: "8px", font: "500 14px 'Noto Sans KR',sans-serif", color: "#555" }}>
              [상품명]
            </Link>
            <div style={{ marginTop: "2px", fontSize: "12px", color: "#767676" }}>
              COLOR [색상] / SIZE [사이즈]
            </div>
            <p style={{ margin: "14px 0 0", fontSize: "14px", lineHeight: "1.8", color: "#222" }}>
              [후기 내용을 입력하세요]
            </p>
            <div style={{ marginTop: "14px", fontSize: "12px", color: "#767676" }}>
              [닉네임] · [YYYY.MM.DD]
            </div>
          </div>
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
