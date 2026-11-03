"use client";

import Link from "next/link";
import { useEffect } from "react";

// 화면을 그리다가 오류가 났을 때 보이는 화면입니다. 오류는 자동으로 관리자에게 기록됩니다.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    fetch("/api/log-error", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: error.message, digest: error.digest, path: window.location.pathname }) }).catch(() => undefined);
  }, [error]);

  return (
    <section style={{ maxWidth: 480, margin: "0 auto", padding: "96px 24px 0", textAlign: "center" }}>
      <h1 style={{ margin: 0, font: "800 28px Archivo,'Noto Sans KR',sans-serif" }}>문제가 생겼어요</h1>
      <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.8, color: "#555" }}>
        잠시 후 다시 시도해 주세요. 계속 문제가 생기면 아래 오류 번호와 함께 문의해 주세요.
        {error.digest && <><br /><b style={{ fontFamily: "Archivo,sans-serif" }}>오류 번호 {error.digest}</b></>}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 28 }}>
        <button type="button" onClick={reset} className="btn" style={{ background: "#111", color: "#fff", border: 0, cursor: "pointer" }}>다시 시도</button>
        <Link href="/" className="btn" style={{ border: "1px solid #111" }}>홈으로</Link>
      </div>
    </section>
  );
}
