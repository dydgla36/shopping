import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "로그인" };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <section style={{ maxWidth: 440, margin: "0 auto", padding: "72px 24px 0" }}>
      <h1 style={{ margin: 0, textAlign: "center", font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>LOGIN</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: 32, borderBottom: "1px solid #e5e5e5", textAlign: "center", font: "700 13px 'Noto Sans KR',sans-serif" }}>
        <span style={{ padding: 14, borderBottom: "2px solid #111" }}>로그인</span>
        <a href="#" style={{ padding: 14, color: "#767676" }}>비회원 주문조회</a>
      </div>
      {next && (
        <p style={{ margin: "20px 0 0", padding: "14px 16px", background: "#f4f2ee", fontSize: 13, color: "#555" }}>
          로그인이 필요한 페이지예요. 로그인하면 원래 보려던 화면으로 이동해요.
        </p>
      )}
      <LoginForm next={next} />
      <a className="btn" href="#" style={{ marginTop: 10, background: "#fee500", fontFamily: "'Noto Sans KR',sans-serif", letterSpacing: 0 }}>
        카카오로 3초 가입 · 5% 쿠폰
      </a>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 28, fontSize: 13 }}>
        <Link href="/find-id" style={{ color: "#555" }}>아이디 찾기</Link>
        <Link href="/find-pw" style={{ color: "#555" }}>비밀번호 찾기</Link>
        <Link href="/signup" style={{ color: "#555" }}>회원가입</Link>
      </div>
    </section>
  );
}
