import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "상품 문의 작성" };

export default async function Page() {
  await requireUser("/qna/write");
  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: "12px", color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>
          HOME
        </Link>
        {" "}
        &gt;
        {" "}
        <Link href="/qna" style={{ color: "#767676" }}>
          Q&amp;A
        </Link>
        {" "}
        &gt; 상품 문의 작성
      </div>
      <section style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 0" }}>
        <h1 style={{ margin: "0", textAlign: "center", font: "800 30px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
          Q&amp;A WRITE
        </h1>
        <div style={{ marginTop: "32px", font: "700 13px 'Noto Sans KR',sans-serif" }}>
          문의 유형
        </div>
        <div style={{ marginTop: "10px" }}>
          <input className="opt" type="radio" name="qt" id="q1" defaultChecked />
          <label htmlFor="q1">
            상품 문의
          </label>
          <input className="opt" type="radio" name="qt" id="q2" />
          <label htmlFor="q2">
            배송 문의
          </label>
          <input className="opt" type="radio" name="qt" id="q3" />
          <label htmlFor="q3">
            교환 / 반품
          </label>
          <input className="opt" type="radio" name="qt" id="q4" />
          <label htmlFor="q4">
            기타
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "16px", alignItems: "center", marginTop: "28px", padding: "16px", background: "#f4f2ee" }}>
          <div style={{ aspectRatio: "4/5", background: "#e6e3de" }}>
          </div>
          <div>
            <div style={{ font: "400 12px Archivo,sans-serif", color: "#767676" }}>
              [브랜드명]
            </div>
            <div style={{ marginTop: "4px", fontSize: "14px" }}>
              [상품명]
            </div>
            <div style={{ marginTop: "4px", fontSize: "12px", color: "#767676" }}>
              COLOR [색상] / SIZE [사이즈]
            </div>
          </div>
        </div>
        <label className="fld">
          제목
          <input type="text" placeholder="제목을 입력하세요" />
        </label>
        <label className="fld">
          문의 내용
          <textarea placeholder="문의 내용을 입력하세요" style={{ display: "block", boxSizing: "border-box", width: "100%", height: "220px", marginTop: "8px", padding: "15px 14px", border: "1px solid #ccc", font: "400 15px/1.7 'Noto Sans KR',sans-serif", resize: "vertical" }}>
          </textarea>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px", fontSize: "13px", color: "#333" }}>
          <input type="checkbox" />
          {" "}
          비밀글로 등록
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "36px" }}>
          <Link className="btn" href="/qna" style={{ border: "1px solid #111" }}>
            CANCEL
          </Link>
          <Link className="btn" href="/qna" style={{ background: "#111", color: "#fff" }}>
            SUBMIT
          </Link>
        </div>
      </section>
    </>
  );
}
