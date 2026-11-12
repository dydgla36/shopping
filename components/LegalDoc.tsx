import type { LegalSection } from "@/lib/legal";

// 약관·방침 문서 화면
export default function LegalDoc({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 0" }}>
      <h1 style={{ margin: 0, textAlign: "center", fontSize: 34 }}>{title}</h1>
      {sections.map((s) => (
        <div key={s.title} style={{ marginTop: 32 }}>
          <h3 style={{ margin: 0, font: "700 15px 'Noto Sans KR',sans-serif" }}>{s.title}</h3>
          {s.body.map((t, i) => <p key={i} style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.9, color: "#444", wordBreak: "keep-all" }}>{t}</p>)}
        </div>
      ))}
    </section>
  );
}
