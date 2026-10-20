import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import AuthTabs from "@/components/AuthTabs";
import { requestReset } from "@/app/actions/account";
import { narrow, narrowTitle } from "@/lib/ui";

export const metadata = { title: "비밀번호 찾기" };

export default function Page() {
  return (
    <section style={narrow(440)}>
      <h1 style={narrowTitle}>FIND PASSWORD</h1>
      <AuthTabs active="pw" />
      <p style={{ margin: "24px 0 0", fontSize: 13, lineHeight: 1.7, color: "#555" }}>아이디와 가입 시 입력하신 이메일을 입력하시면 비밀번호 재설정 링크를 메일로 보내드려요.</p>
      <ActionForm action={requestReset} submitLabel="SEND RESET LINK">
        <label className="fld">아이디<input name="loginId" type="text" placeholder="아이디를 입력하세요" required /></label>
        <label className="fld">이메일<input name="email" type="email" placeholder="example@email.com" required /></label>
      </ActionForm>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 28, fontSize: 13 }}>
        <Link href="/login" style={{ color: "#555" }}>로그인</Link>
        <Link href="/find-id" style={{ color: "#555" }}>아이디 찾기</Link>
      </div>
    </section>
  );
}
