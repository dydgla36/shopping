import Link from "next/link";
import { prisma } from "@/lib/db";
import { FAQ_CATEGORIES } from "@/lib/faq";
import { chip, crumb } from "@/lib/ui";

export const metadata = { title: "자주 묻는 질문" };

export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const sp = await searchParams;
  const category = sp.category && FAQ_CATEGORIES.includes(sp.category) ? sp.category : undefined;
  const faqs = await prisma.faq.findMany({ where: category ? { category } : {}, orderBy: [{ position: "asc" }, { id: "asc" }] }).catch(() => []);
  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; FAQ</div>
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "20px 24px 0" }}>
        <h1 style={{ margin: 0, textAlign: "center", fontSize: 36 }}>FAQ</h1>
        <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 14, color: "#555" }}>자주 묻는 질문</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 28 }}>
          <Link href="/faq" style={chip(!category)}>전체</Link>
          {FAQ_CATEGORIES.map((c) => <Link key={c} href={`/faq?category=${encodeURIComponent(c)}`} style={chip(category === c)}>{c}</Link>)}
        </div>
        <div style={{ marginTop: 28, borderTop: "1px solid #111" }}>
          {faqs.length === 0 && <div style={{ padding: "40px 12px", fontSize: 14, color: "#767676", textAlign: "center" }}>등록된 질문이 없어요. 궁금한 점은 <Link href="/qna/write" style={{ borderBottom: "1px solid #555" }}>Q&amp;A</Link>로 남겨 주세요.</div>}
          {faqs.map((f) => (
            <details key={f.id} style={{ borderBottom: "1px solid #e5e5e5" }}>
              <summary style={{ cursor: "pointer", padding: "18px 4px", fontSize: 15, listStyle: "none" }}><span style={{ marginRight: 10, color: "#8a6f66", fontSize: 12 }}>[{f.category}]</span>{f.question}</summary>
              <div style={{ padding: "0 4px 22px", fontSize: 14, lineHeight: 1.9, color: "#444", whiteSpace: "pre-line" }}>{f.answer}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
