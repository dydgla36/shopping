import Link from "next/link";

export const metadata = { title: "페이지를 찾을 수 없어요" };

export default function NotFound() {
  return (
    <section style={{ maxWidth: 480, margin: "0 auto", padding: "96px 24px 0", textAlign: "center" }}>
      <div style={{ font: "800 64px Archivo,sans-serif" }}>404</div>
      <h1 style={{ margin: "8px 0 0", font: "700 20px 'Noto Sans KR',sans-serif" }}>페이지를 찾을 수 없어요</h1>
      <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.8, color: "#555" }}>주소가 바뀌었거나 없어진 페이지예요.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 28 }}>
        <Link href="/" className="btn" style={{ background: "#111", color: "#fff" }}>홈으로</Link>
        <Link href="/list/women" className="btn" style={{ border: "1px solid #111" }}>상품 보기</Link>
      </div>
    </section>
  );
}
