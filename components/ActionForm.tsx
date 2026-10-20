"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";

export type ActionState = { error?: string; ok?: string } | undefined;

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  resetOnSuccess?: boolean;
  children: React.ReactNode;
};

// 서버 동작(action)에 연결된 공통 폼입니다. 오류 문구와 완료 문구를 폼 아래에 보여주고,
// 오류가 나도 입력한 내용이 지워지지 않게 합니다.
export default function ActionForm({ action, submitLabel, resetOnSuccess, children }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
    >
      {children}
      {state?.error && <p role="alert" style={{ margin: "16px 0 0", fontSize: 13, color: "#c0392b" }}>{state.error}</p>}
      {state?.ok && <p role="status" style={{ margin: "16px 0 0", fontSize: 13, color: "#2d6a2d" }}>{state.ok}</p>}
      <button className="btn" type="submit" disabled={pending} style={{ width: "100%", marginTop: 24, background: "#111", color: "#fff", border: 0, cursor: "pointer" }}>
        {pending ? "..." : submitLabel}
      </button>
    </form>
  );
}
