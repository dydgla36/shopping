import Link from "next/link";

// 아이디 찾기 / 비밀번호 찾기 탭
export default function AuthTabs({ active }: { active: "id" | "pw" }) {
  const tab = (label: string, href: string, on: boolean) => (
    <Link href={href} style={{ padding: 14, borderBottom: on ? "2px solid #111" : undefined, color: on ? undefined : "#767676", font: `${on ? 700 : 500} 13px 'Noto Sans KR',sans-serif` }}>{label}</Link>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: 32, borderBottom: "1px solid #e5e5e5", textAlign: "center" }}>
      {tab("아이디 찾기", "/find-id", active === "id")}
      {tab("비밀번호 찾기", "/find-pw", active === "pw")}
    </div>
  );
}
