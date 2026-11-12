import Link from "next/link";
import HomeRow from "@/components/HomeRow";
import { prisma } from "@/lib/db";
import { thumb } from "@/lib/imageUrl";
import { lists } from "@/lib/lists";
import { getListProducts } from "@/lib/products";
import { maskName } from "@/lib/mask";
import { fmtDate } from "@/lib/orders";
import { stars } from "@/lib/ui";

export const metadata = { title: { absolute: "GABBY" } };

// ===== 메인 화면 문구: 여기에서 바꾸세요 =====
const HERO = {
  eyebrow: "NEW ARRIVALS",
  title: ["새 계절,", "새로운 옷장"],
  text: "지금 가장 많이 사랑받는 아이템을 만나보세요.",
};
// 히어로 배경 사진: 환경 변수 HERO_IMAGE_URL에 이미지 주소(https://... 또는 /api/product-image/...)를 넣으면 보입니다. 없으면 부드러운 색 배경입니다.
const heroImage = (() => {
  const v = process.env.HERO_IMAGE_URL ?? "";
  return /^(https:\/\/|\/)/.test(v) ? v : "";
})();

export default async function Page() {
  const [fresh, best, women, reviews, notices] = await Promise.all([
    getListProducts("new", { perPage: 4 }),
    getListProducts("best", { perPage: 4 }),
    getListProducts("women", { perPage: 1 }),
    prisma.review.findMany({ orderBy: { createdAt: "desc" }, take: 3, include: { product: { select: { id: true, name: true } }, user: { select: { name: true } } } }).catch(() => []),
    prisma.notice.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], take: 4 }).catch(() => []),
  ]);

  // 카테고리 타일: 각 카테고리의 가장 최근 상품 사진을 배경으로 씁니다.
  const tiles = [
    { slug: "women", img: women.items[0]?.imageUrl },
    { slug: "best", img: best.items[0]?.imageUrl },
    { slug: "new", img: fresh.items[0]?.imageUrl },
  ];

  return (
    <>
      <section
        className="hero"
        style={{
          color: heroImage ? "#fff" : "#2b2420",
          background: heroImage ? `linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)), url(${heroImage}) center/cover no-repeat` : "linear-gradient(135deg,#f6e9e4 0%,#efe6dc 48%,#e6dde6 100%)",
        }}
      >
        <div className="hero-in">
          <div className="hero-eyebrow">{HERO.eyebrow}</div>
          <h1>{HERO.title[0]}<br />{HERO.title[1]}</h1>
          <p>{HERO.text}</p>
          <div className="hero-btns">
            <Link href="/list/new" className={heroImage ? "hero-btn" : "hero-btn solid"}>SHOP NOW</Link>
            <Link href="/list/best" className="hero-btn">BEST</Link>
          </div>
        </div>
      </section>

      <div className="tiles">
        {tiles.map(({ slug, img }) => (
          <Link key={slug} href={`/list/${slug}`} className="tile" aria-label={`${lists[slug]?.title} 보기`}>
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumb(img, 800)} alt="" loading="lazy" />
            )}
            <div className={img ? "tile-label" : "tile-label dark"}>
              <b>{lists[slug]?.title}</b>
              <span>{lists[slug]?.sub}</span>
            </div>
          </Link>
        ))}
      </div>

      <HomeRow title="NEW ARRIVALS" sub="새로 들어온 상품" href="/list/new" items={fresh.items} />
      <HomeRow title="BEST" sub="지금 가장 많이 선택되는 아이템" href="/list/best" items={best.items} />

      {reviews.length > 0 && (
        <section className="sec">
          <div className="sh2"><h2>REVIEW</h2><p>구매하신 분들의 이야기</p><Link href="/review">VIEW ALL</Link></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {reviews.map((r) => (
              <Link key={r.id} href={`/product/${r.product.id}`} style={{ display: "block", padding: 28, background: "#f7f3ef" }}>
                <div aria-label={`별점 ${r.rating}점`} style={{ font: "500 14px Archivo,sans-serif", letterSpacing: ".12em", color: "#8a6f66" }}>{stars(r.rating)}</div>
                <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.8, color: "#2b2420" }}>{r.content.length > 90 ? `${r.content.slice(0, 90)}…` : r.content}</p>
                <div style={{ marginTop: 16, fontSize: 12, color: "#7b6c66" }}>{r.product.name}</div>
                <div style={{ marginTop: 4, fontSize: 11, color: "#a89c96" }}>{maskName(r.user.name)} · {fmtDate(r.createdAt)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {notices.length > 0 && (
        <section className="sec" style={{ maxWidth: 880 }}>
          <div className="sh2"><h2>NOTICE</h2><Link href="/notice">VIEW ALL</Link></div>
          <div style={{ borderTop: "1px solid #111" }}>
            {notices.map((n) => (
              <Link key={n.id} href={`/notice/${n.id}`} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "18px 4px", borderBottom: "1px solid #eee", fontSize: 14 }}>
                <span style={{ fontWeight: n.pinned ? 700 : 400 }}>{n.title}</span>
                <span style={{ color: "#a89c96", flex: "none", fontSize: 12 }}>{fmtDate(n.createdAt)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
