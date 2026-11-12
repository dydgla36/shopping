import { parseDetail } from "@/lib/productContent";

// 상품 상세 내용: 관리자가 넣은 글과 이미지를 순서대로 보여줍니다. 내용이 없으면 아무것도 보이지 않습니다.
export default function ProductDetailContent({ raw }: { raw: string | null }) {
  const blocks = parseDetail(raw);
  if (blocks.length === 0) return null;
  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {blocks.map((b, i) =>
        b.t === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img decoding="async" key={i} src={b.v} alt="" loading="lazy" style={{ display: "block", width: "100%", height: "auto", margin: "0 auto" }} />
        ) : (
          <p key={i} style={{ margin: "28px 0", padding: "0 8px", fontSize: 15, lineHeight: 2, textAlign: "center", color: "#2b2420", whiteSpace: "pre-line", wordBreak: "keep-all" }}>{b.v}</p>
        ),
      )}
    </div>
  );
}
