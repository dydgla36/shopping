import Link from "next/link";

type Props = { name: string; price: string; bg?: string; sale?: string };

export default function ProductCard({ name, price, bg = "#e6e3de", sale }: Props) {
  return (
    <Link className="card" href="/product">
      <div className="ph" style={{ background: bg }} />
      <b>[브랜드명]</b>
      <span>{name}</span>
      <i>
        {sale && <em style={{ color: "#c0392b" }}>{sale}</em>}
        {price}
      </i>
    </Link>
  );
}
