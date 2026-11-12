import { ImageResponse } from "next/og";

// 링크를 공유할 때 보이는 기본 대표 이미지입니다. (상품 화면은 상품 사진이 대신 쓰입니다)
export const alt = "GABBY";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f6e9e4 0%,#efe6dc 50%,#e6dde6 100%)", color: "#2b2420", fontSize: 120, letterSpacing: 28 }}>GABBY</div>,
    size,
  );
}
