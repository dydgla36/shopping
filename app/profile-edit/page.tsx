import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "회원 정보 수정" };

export default async function Page() {
  await requireUser("/profile-edit");
  return (
    <>
      <div style={{ padding: "24px 60px 0", fontSize: "12px", color: "#767676" }}>
        <Link href="/" style={{ color: "#767676" }}>
          HOME
        </Link>
        {" "}
        &gt;
        {" "}
        <Link href="/mypage" style={{ color: "#767676" }}>
          MY PAGE
        </Link>
        {" "}
        &gt; 회원 정보 수정
      </div>
      <section style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 0" }}>
        <h1 style={{ margin: "0", textAlign: "center", font: "800 30px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
          EDIT PROFILE
        </h1>
        <label className="fld" style={{ marginTop: "32px" }}>
          아이디
          <input type="text" value="[아이디]" disabled style={{ background: "#f4f2ee", color: "#767676" }} />
        </label>
        <label className="fld">
          이름
          <input type="text" placeholder="이름을 입력하세요" />
        </label>
        <label className="fld">
          이메일
          <input type="email" placeholder="example@email.com" />
        </label>
        <label className="fld">
          휴대전화
          <input type="tel" placeholder="010-0000-0000" />
        </label>
        <div style={{ marginTop: "44px", paddingBottom: "12px", borderBottom: "1px solid #111", font: "800 15px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>
          비밀번호 변경
        </div>
        <label className="fld">
          현재 비밀번호
          <input type="password" placeholder="현재 비밀번호" />
        </label>
        <label className="fld">
          새 비밀번호
          <input type="password" placeholder="영문, 숫자 포함 8자 이상" />
        </label>
        <label className="fld">
          새 비밀번호 확인
          <input type="password" placeholder="새 비밀번호를 다시 입력하세요" />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "28px", fontSize: "13px", color: "#333" }}>
          <input type="checkbox" />
          {" "}
          마케팅 정보 수신 동의
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "36px" }}>
          <Link className="btn" href="/mypage" style={{ border: "1px solid #111" }}>
            CANCEL
          </Link>
          <Link className="btn" href="/mypage" style={{ background: "#111", color: "#fff" }}>
            SAVE
          </Link>
        </div>
        <div style={{ marginTop: "28px", textAlign: "center" }}>
          <a href="#" style={{ fontSize: "12px", color: "#767676", borderBottom: "1px solid #767676" }}>
            회원 탈퇴
          </a>
        </div>
      </section>
    </>
  );
}
