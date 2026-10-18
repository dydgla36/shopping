"use client";

import { useActionState } from "react";
import { changeAdminPassword } from "@/app/actions/admin";
import { btnDark, input, notice } from "@/app/admin/styles";

export default function AdminPasswordForm() {
  const [state, action, pending] = useActionState(changeAdminPassword, undefined);
  const label = { display: "block", marginTop: 16, fontSize: 12, color: "#767676" } as const;
  return (
    <form action={action} style={{ maxWidth: 420 }}>
      <label style={label}>현재 비밀번호<input name="current" type="password" autoComplete="current-password" required style={{ ...input, marginTop: 6 }} /></label>
      <label style={label}>새 비밀번호 (영문, 숫자 포함 8자 이상)<input name="next" type="password" autoComplete="new-password" required style={{ ...input, marginTop: 6 }} /></label>
      <label style={label}>새 비밀번호 확인<input name="confirm" type="password" autoComplete="new-password" required style={{ ...input, marginTop: 6 }} /></label>
      {state?.error && <div style={notice(false)} role="alert">{state.error}</div>}
      {state?.ok && <div style={notice(true)} role="status">비밀번호를 바꿨어요.</div>}
      <button type="submit" disabled={pending} style={{ ...btnDark, marginTop: 20 }}>{pending ? "..." : "CHANGE PASSWORD"}</button>
    </form>
  );
}
