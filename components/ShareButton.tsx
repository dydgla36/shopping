"use client";

import { useState } from "react";

// 공유하기: 휴대폰에서는 공유 창을, 컴퓨터에서는 주소 복사를 합니다.
export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 공유를 취소했거나 복사할 수 없는 경우는 조용히 넘어갑니다.
    }
  }
  return (
    <button type="button" onClick={share} style={{ marginTop: 10, padding: 0, border: 0, background: "none", color: "#767676", font: "500 12px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".1em", cursor: "pointer", borderBottom: "1px solid #bbb" }}>
      {copied ? "링크를 복사했어요" : "SHARE 공유하기"}
    </button>
  );
}
