import Link from "next/link";

export const metadata = { title: "비밀번호 찾기" };

export default function Page() {
  return (
    <>
      <section style={{ maxWidth: "440px", margin: "0 auto", padding: "72px 24px 0" }}>
        <h1 style={{ margin: "0", textAlign: "center", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>
          FIND PASSWORD
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: "32px", borderBottom: "1px solid #e5e5e5", textAlign: "center" }}>
          <Link href="/find-id" style={{ padding: "14px", color: "#767676", font: "500 13px 'Noto Sans KR',sans-serif" }}>
            아이디 찾기
          </Link>
          <Link href="/find-pw" style={{ padding: "14px", borderBottom: "2px solid #111", fontWeight: "700", font: "700 13px 'Noto Sans KR',sans-serif" }}>
            비밀번호 찾기
          </Link>
        </div>
        <p style={{ margin: "24px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#555" }}>
          아이디와 가입 시 입력하신 이메일을 입력하시면 비밀번호 재설정 안내를 보내드려요.
        </p>
        <label className="fld">
          아이디
          <input type="text" placeholder="아이디를 입력하세요" />
        </label>
        <label className="fld">
          이름
          <input type="text" placeholder="이름을 입력하세요" />
        </label>
        <label className="fld">
          이메일
          <input type="email" placeholder="example@email.com" />
        </label>
        <a className="btn" href="#" style={{ marginTop: "28px", background: "#111", color: "#fff" }}>
          SEND RESET LINK
        </a>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "28px", fontSize: "13px" }}>
          <Link href="/login" style={{ color: "#555" }}>
            로그인
          </Link>
          <Link href="/find-id" style={{ color: "#555" }}>
            아이디 찾기
          </Link>
        </div>
      </section>
    </>
  );
}
