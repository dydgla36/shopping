import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "후기 작성" };

export default async function Page() {
  await requireUser("/review/write");
  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: "12px", color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>
          HOME
        </Link>
        {" "}
        &gt;
        {" "}
        <Link href="/review" style={{ color: "#767676" }}>
          REVIEW
        </Link>
        {" "}
        &gt; 후기 작성
      </div>
      <section style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 0" }}>
        <h1 style={{ margin: "0", textAlign: "center", font: "800 30px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
          REVIEW WRITE
        </h1>
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
        <div style={{ marginTop: "32px", font: "700 13px 'Noto Sans KR',sans-serif" }}>
          별점
        </div>
        <div style={{ marginTop: "10px" }}>
          <input className="opt" type="radio" name="rt" id="r5" defaultChecked />
          <label htmlFor="r5">
            ★★★★★ 5점
          </label>
          <input className="opt" type="radio" name="rt" id="r4" />
          <label htmlFor="r4">
            ★★★★ 4점
          </label>
          <input className="opt" type="radio" name="rt" id="r3" />
          <label htmlFor="r3">
            ★★★ 3점
          </label>
          <input className="opt" type="radio" name="rt" id="r2" />
          <label htmlFor="r2">
            ★★ 2점
          </label>
          <input className="opt" type="radio" name="rt" id="r1" />
          <label htmlFor="r1">
            ★ 1점
          </label>
        </div>
        <label className="fld">
          제목
          <input type="text" placeholder="제목을 입력하세요" />
        </label>
        <label className="fld">
          후기 내용
          <textarea placeholder="착용감, 사이즈, 소재 등 후기를 입력하세요" style={{ display: "block", boxSizing: "border-box", width: "100%", height: "220px", marginTop: "8px", padding: "15px 14px", border: "1px solid #ccc", font: "400 15px/1.7 'Noto Sans KR',sans-serif", resize: "vertical" }}>
          </textarea>
        </label>
        <label className="fld">
          사진 첨부
          <input type="file" accept="image/*" multiple style={{ padding: "14px", border: "1px dashed #999", background: "#faf9f7" }} />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "36px" }}>
          <Link className="btn" href="/review" style={{ border: "1px solid #111" }}>
            CANCEL
          </Link>
          <Link className="btn" href="/review" style={{ background: "#111", color: "#fff" }}>
            SUBMIT
          </Link>
        </div>
      </section>
    </>
  );
}
