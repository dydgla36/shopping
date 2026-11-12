import Link from "next/link";
import ReturnPolicy from "@/components/ReturnPolicy";
import { crumb } from "@/lib/ui";

export const metadata = { title: "배송·교환·반품 안내" };

export default function Page() {
  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; 배송·교환·반품 안내</div>
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "20px 24px 0" }}>
        <h1 style={{ margin: 0, textAlign: "center", fontSize: 36 }}>SHIPPING &amp; RETURN</h1>
        <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 14, color: "#555" }}>배송·교환·반품 안내</p>
        <ReturnPolicy />
      </section>
    </>
  );
}
