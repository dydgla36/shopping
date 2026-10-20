"use client";

import { startTransition, useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginForm({ next = "" }: { next?: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  // 오류가 나도 입력한 내용이 지워지지 않도록 직접 제출합니다.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="next" value={next} />
      <label className="fld">
        아이디
        <input name="loginId" type="text" placeholder="아이디를 입력하세요" autoComplete="username" required />
      </label>
      <label className="fld">
        비밀번호
        <input name="password" type="password" placeholder="비밀번호를 입력하세요" autoComplete="current-password" required />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13, color: "#555" }}>
        <input name="remember" type="checkbox" /> 로그인 상태 유지
      </label>
      {state?.error && (
        <p role="alert" style={{ margin: "16px 0 0", fontSize: 13, color: "#c0392b" }}>{state.error}</p>
      )}
      <button className="btn" type="submit" disabled={pending} style={{ width: "100%", marginTop: 24, background: "#111", color: "#fff", border: 0, cursor: "pointer" }}>
        {pending ? "..." : "LOGIN"}
      </button>
    </form>
  );
}
