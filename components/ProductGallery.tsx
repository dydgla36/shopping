"use client";

import { useState } from "react";

// 상품 상세의 이미지: 큰 이미지 아래의 작은 사진을 누르면 큰 이미지가 바뀝니다.
export default function ProductGallery({ images, bg, name, soldOut }: { images: string[]; bg: string; name: string; soldOut: boolean }) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  return (
    <div>
      <div style={{ aspectRatio: "4/5", background: bg, position: "relative", overflow: "hidden" }}>
        {current && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt={name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {soldOut && (
          <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 0", textAlign: "center", background: "rgba(17,17,17,.85)", color: "#fff", font: "700 13px Archivo,sans-serif", letterSpacing: ".12em" }}>SOLD OUT</span>
        )}
      </div>
      {images.length > 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, marginTop: 8 }}>
          {images.map((src, n) => (
            <button key={`${src}-${n}`} type="button" onClick={() => setIndex(n)} aria-label={`${name} 이미지 ${n + 1}`} aria-pressed={n === index} style={{ padding: 0, aspectRatio: "1", overflow: "hidden", background: "#fff", cursor: "pointer", border: n === index ? "2px solid #111" : "1px solid #ddd" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
