import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import PhoneInput from "@/components/PhoneInput";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { changePassword, updateProfile, withdrawAccount } from "@/app/actions/account";
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
          <label className="fld">휴대전화<PhoneInput name="phone" defaultValue={user.phone} required /></label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13, color: "#555" }}><input name="marketing" type="checkbox" defaultChecked={user.marketingOptIn} /> 마케팅 정보 수신 동의</label>
        </ActionForm>

        <div style={title}>비밀번호 변경</div>
        <ActionForm action={changePassword} submitLabel="CHANGE PASSWORD" resetOnSuccess>
          <label className="fld">현재 비밀번호<input name="current" type="password" autoComplete="current-password" required /></label>
          <label className="fld">새 비밀번호 (영문, 숫자 포함 8자 이상)<input name="next" type="password" autoComplete="new-password" required /></label>
          <label className="fld">새 비밀번호 확인<input name="confirm" type="password" autoComplete="new-password" required /></label>
        </ActionForm>

        <details style={{ marginTop: 56, borderTop: "1px solid #e5e5e5", paddingTop: 20 }}>
          <summary style={{ cursor: "pointer", fontSize: 13, color: "#c0392b" }}>회원 탈퇴</summary>
          <div style={{ marginTop: 16, padding: 20, background: "#fbf3f2", fontSize: 13, lineHeight: 1.8, color: "#444" }}>
            <b>탈퇴하기 전에 확인해 주세요</b>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              <li>회원 정보(이름·이메일·연락처), 배송지, 장바구니, 관심 상품, 쿠폰, 적립금, 작성한 후기·문의가 <b>모두 삭제</b>되고 되돌릴 수 없어요.</li>
              <li>주문·결제·배송 기록(주문자·수령인·주소 포함)은 관련 법령에 따라 일정 기간 보관한 뒤 삭제돼요.</li>
              <li>배송 중이거나 처리 중인 주문·신청이 있으면 탈퇴할 수 없어요.</li>
            </ul>
          </div>
          <ActionForm action={withdrawAccount} submitLabel="회원 탈퇴하기" confirmMessage="정말 탈퇴할까요? 탈퇴하면 되돌릴 수 없어요.">
            {user.kakaoId ? (
              <label className="fld">확인을 위해 &quot;탈퇴&quot;라고 입력해 주세요<input name="confirm" type="text" autoComplete="off" required /></label>
            ) : (
              <label className="fld">비밀번호 확인<input name="password" type="password" autoComplete="current-password" required /></label>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13, color: "#555" }}><input name="agree" type="checkbox" /> 위 안내를 확인했고, 탈퇴에 동의합니다</label>
          </ActionForm>
        </details>
      </section>
    </>
  );
}
