import AdminPasswordForm from "@/components/AdminPasswordForm";
import { requireAdmin } from "@/lib/admin";
import { h2 } from "../styles";

export default async function Page() {
  const admin = await requireAdmin("/admin/account");
  return (
    <>
      <h2 style={h2}>관리자 계정</h2>
      <p style={{ margin: "8px 0 0", fontSize: 14, color: "#555" }}>로그인 아이디: <b>{admin.loginId}</b></p>
      <div style={{ marginTop: 20, padding: "14px 16px", background: "#fbeeee", color: "#c0392b", fontSize: 13, lineHeight: 1.7 }}>
        처음 설정한 비밀번호(admin)는 누구나 추측할 수 있어요. 사이트를 공개하기 전에 꼭 바꿔 주세요.
      </div>
      <div style={{ marginTop: 28, paddingBottom: 14, borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif" }}>비밀번호 변경</div>
      <AdminPasswordForm />
    </>
  );
}
