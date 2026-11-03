"use client";

import { useEffect } from "react";

// 사이트 전체 화면(레이아웃)에서 오류가 났을 때 보이는 마지막 안전 화면입니다.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    fetch("/api/log-error", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: error.message, digest: error.digest, path: window.location.pathname }) }).catch(() => undefined);
  }, [error]);

  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "'Noto Sans KR',sans-serif", color: "#111", background: "#fff" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "96px 24px 0", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>문제가 생겼어요</h1>
          <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.8, color: "#555" }}>
            잠시 후 다시 시도해 주세요.{error.digest && <><br />오류 번호 {error.digest}</>}
          </p>
          <button type="button" onClick={reset} style={{ marginTop: 28, padding: "14px 28px", background: "#111", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>다시 시도</button>
        </div>
      </body>
    </html>
  );
}
