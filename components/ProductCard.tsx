import Link from "next/link";

type Props = { id?: number; name: string; price: string; bg?: string; sale?: string; imageUrl?: string };

export default function ProductCard({ id, name, price, bg = "#e6e3de", sale, imageUrl }: Props) {
  return (
    <Link className="card" href={id ? `/product/${id}` : "/product"}>
      <div className="ph" style={{ background: bg, position: "relative", overflow: "hidden" }}>
        {imageUrl && (
          // 관리자가 입력한 외부 이미지 주소를 그대로 보여줍니다.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
      <b>[브랜드명]</b>
      <span>{name}</span>
      <i>
        {sale && <em style={{ color: "#c0392b" }}>{sale}</em>}
        {price}
      </i>
    </Link>
  );
}
