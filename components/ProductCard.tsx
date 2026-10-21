import Link from "next/link";

type Props = { id?: number; name: string; price: string; finalPrice?: string; bg?: string; sale?: string; imageUrl?: string; soldOut?: boolean };

export default function ProductCard({ id, name, price, finalPrice, bg = "#e6e3de", sale, imageUrl, soldOut }: Props) {
  return (
    <Link className="card" href={id ? `/product/${id}` : "/product"}>
      <div className="ph" style={{ background: bg, position: "relative", overflow: "hidden" }}>
        {imageUrl && (
          // 관리자가 입력한 외부 이미지 주소를 그대로 보여줍니다.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {soldOut && (
          <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "8px 0", textAlign: "center", background: "rgba(17,17,17,.85)", color: "#fff", font: "700 12px Archivo,sans-serif", letterSpacing: ".1em" }}>SOLD OUT</span>
        )}
      </div>
      <b>[브랜드명]</b>
      <span>{name}</span>
      <i>
        {sale && finalPrice ? (
          <>
            <s style={{ marginRight: 8, color: "#767676", fontWeight: 400 }}>{price}</s>
            <em style={{ color: "#c0392b" }}>{sale}</em>
            {finalPrice}
          </>
        ) : (
          <>
            {sale && <em style={{ color: "#c0392b" }}>{sale}</em>}
            {price}
          </>
        )}
      </i>
    </Link>
  );
}
