import HomeRow from "@/components/HomeRow";
import Link from "next/link";

export const metadata = { title: "패션 쇼핑몰 홈페이지" };

export default function Page() {
  return (
    <>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", minHeight: "640px" }}>
        <div style={{ background: "#d9d5ce", minHeight: "420px" }}>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px", padding: "60px", background: "#f4f2ee" }}>
          <div style={{ font: "700 13px Archivo,sans-serif", letterSpacing: ".14em" }}>
            NEW ARRIVALS
          </div>
          <h1 style={{ margin: "0", font: "800 64px/1.05 Archivo,'Noto Sans KR',sans-serif" }}>
            감각적인 컬렉션,
            <br />
            그 이상의 완성
          </h1>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.7", color: "#444", maxWidth: "420px" }}>
            매주 업데이트되는 브랜드 아카이브. 지금 가장 많이 선택되는 아이템을 만나보세요.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/list/new" style={{ background: "#111", color: "#fff", padding: "16px 28px", font: "700 13px Archivo,sans-serif", letterSpacing: ".08em" }}>
              WOMEN'S NEW
            </Link>
            <Link href="/list/new" style={{ border: "1px solid #111", padding: "15px 28px", font: "700 13px Archivo,sans-serif", letterSpacing: ".08em" }}>
              MEN'S NEW
            </Link>
          </div>
        </div>
      </section>
      <HomeRow title="WOMEN'S NEW" href="/list/women" slug="women" />
      <HomeRow title="MEN'S NEW" href="/list/men" slug="men" />
      <HomeRow title="WOMEN BEST" href="/list/best" slug="best" />
    </>
  );
}
