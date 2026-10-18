import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export const metadata = { title: "회원가입" };

export default function Page() {
  return (
    <section style={{ maxWidth: 520, margin: "0 auto", padding: "72px 24px 0" }}>
      <h1 style={{ margin: 0, textAlign: "center", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>JOIN</h1>
      <a className="btn" href="#" style={{ marginTop: 32, background: "#fee500", fontFamily: "'Noto Sans KR',sans-serif", letterSpacing: 0 }}>
        카카오로 3초 가입 · 5% 쿠폰
      </a>
      <div style={{ margin: "28px 0 0", textAlign: "center", fontSize: 12, color: "#767676" }}>또는 이메일로 가입</div>
      <SignupForm />
      <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "#555" }}>
        이미 회원이신가요? <Link href="/login" style={{ borderBottom: "1px solid #111" }}>로그인</Link>
      </div>
    </section>
  );
}
