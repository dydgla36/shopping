import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import AuthTabs from "@/components/AuthTabs";
import { findId } from "@/app/actions/account";
import { narrow, narrowTitle } from "@/lib/ui";

export const metadata = { title: "아이디 찾기" };

export default function Page() {
  return (
    <section style={narrow(440)}>
      <h1 style={narrowTitle}>FIND ID</h1>
      <AuthTabs active="id" />
      <p style={{ margin: "24px 0 0", fontSize: 13, lineHeight: 1.7, color: "#555" }}>가입 시 입력하신 이름과 이메일을 입력해 주세요.</p>
      <ActionForm action={findId} submitLabel="FIND ID">
        <label className="fld">이름<input name="name" type="text" placeholder="이름을 입력하세요" required /></label>
        <label className="fld">이메일<input name="email" type="email" placeholder="example@email.com" required /></label>
      </ActionForm>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 28, fontSize: 13 }}>
        <Link href="/login" style={{ color: "#555" }}>로그인</Link>
        <Link href="/signup" style={{ color: "#555" }}>회원가입</Link>
      </div>
    </section>
  );
}
