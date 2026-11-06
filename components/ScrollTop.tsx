"use client";

import { useEffect, useState } from "react";

// 아래로 내려오면 나타나는 "맨 위로" 버튼
export default function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button type="button" className="to-top" aria-label="맨 위로 가기" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      TOP
    </button>
  );
}
