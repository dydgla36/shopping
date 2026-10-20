import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { changePassword, updateProfile } from "@/app/actions/account";
import { crumb } from "@/lib/ui";

export const metadata = { title: "회원 정보 수정" };

const title = { marginTop: 40, paddingBottom: 14, borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" } as const;

export default async function Page() {
  const me = await requireUser("/profile-edit");
  const user = await prisma.user.findUnique({ where: { id: me.id } });
  if (!user) return null;

  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/mypage" style={{ color: "#767676" }}>MY PAGE</Link> &gt; 회원 정보 수정</div>
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "20px 24px 0" }}>
        <h1 style={{ margin: 0, font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>EDIT PROFILE</h1>

        <div style={title}>회원 정보</div>
        <ActionForm action={updateProfile} submitLabel="SAVE">
          <label className="fld">아이디<input type="text" value={user.loginId} readOnly disabled style={{ background: "#f4f2ee" }} /></label>
          <label className="fld">이름<input name="name" type="text" defaultValue={user.name} required /></label>
          <label className="fld">이메일<input name="email" type="email" defaultValue={user.email} required /></label>
          <label className="fld">휴대전화<input name="phone" type="tel" defaultValue={user.phone} required /></label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13, color: "#555" }}><input name="marketing" type="checkbox" defaultChecked={user.marketingOptIn} /> 마케팅 정보 수신 동의</label>
        </ActionForm>

        <div style={title}>비밀번호 변경</div>
        <ActionForm action={changePassword} submitLabel="CHANGE PASSWORD" resetOnSuccess>
          <label className="fld">현재 비밀번호<input name="current" type="password" autoComplete="current-password" required /></label>
          <label className="fld">새 비밀번호 (영문, 숫자 포함 8자 이상)<input name="next" type="password" autoComplete="new-password" required /></label>
          <label className="fld">새 비밀번호 확인<input name="confirm" type="password" autoComplete="new-password" required /></label>
        </ActionForm>
      </section>
    </>
  );
}
