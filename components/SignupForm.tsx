"use client";

import { startTransition, useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";

const row = { display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontSize: 13, color: "#333" } as const;

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  // 오류가 나도 입력한 내용이 지워지지 않도록 직접 제출합니다.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }
  const [agree, setAgree] = useState({ terms: false, privacy: false, marketing: false });
  const all = agree.terms && agree.privacy && agree.marketing;
  const toggle = (key: keyof typeof agree) => setAgree((a) => ({ ...a, [key]: !a[key] }));

  return (
    <form onSubmit={onSubmit}>
      <label className="fld">
        아이디
        <input name="loginId" type="text" placeholder="영문, 숫자 4~16자" autoComplete="username" required />
      </label>
      <label className="fld">
        비밀번호
        <input name="password" type="password" placeholder="영문, 숫자 포함 8자 이상" autoComplete="new-password" required />
      </label>
      <label className="fld">
        비밀번호 확인
        <input name="passwordConfirm" type="password" placeholder="비밀번호를 다시 입력하세요" autoComplete="new-password" required />
      </label>
      <label className="fld">
        이름
        <input name="name" type="text" placeholder="이름을 입력하세요" autoComplete="name" required />
      </label>
      <label className="fld">
        이메일
        <input name="email" type="email" placeholder="example@email.com" autoComplete="email" required />
      </label>
      <label className="fld">
        휴대전화
        <input name="phone" type="tel" placeholder="010-0000-0000" autoComplete="tel" required />
      </label>
      <div style={{ marginTop: 32, padding: 20, background: "#f4f2ee" }}>
        <label style={{ ...row, fontWeight: 700 }}>
          <input
            type="checkbox"
            checked={all}
            onChange={() => setAgree(all ? { terms: false, privacy: false, marketing: false } : { terms: true, privacy: true, marketing: true })}
          />
          전체 동의
        </label>
        <div style={{ marginTop: 12, borderTop: "1px solid #ddd" }} />
        <label style={row}>
          <input name="terms" type="checkbox" checked={agree.terms} onChange={() => toggle("terms")} /> [필수] 이용약관 동의
        </label>
        <label style={row}>
          <input name="privacy" type="checkbox" checked={agree.privacy} onChange={() => toggle("privacy")} /> [필수] 개인정보 수집 및 이용 동의
        </label>
        <label style={row}>
          <input name="marketing" type="checkbox" checked={agree.marketing} onChange={() => toggle("marketing")} /> [선택] 마케팅 정보 수신 동의
        </label>
      </div>
      {state?.error && (
        <p role="alert" style={{ margin: "16px 0 0", fontSize: 13, color: "#c0392b" }}>{state.error}</p>
      )}
      <button className="btn" type="submit" disabled={pending} style={{ width: "100%", marginTop: 24, background: "#111", color: "#fff", border: 0, cursor: "pointer" }}>
        {pending ? "..." : "JOIN"}
      </button>
    </form>
  );
}
