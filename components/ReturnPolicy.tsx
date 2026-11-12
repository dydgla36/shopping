import { CS_TEXT, RETURN_ADDRESS, RETURN_POLICY, SHIPPING_POLICY, type PolicySection } from "@/lib/policy";

// 배송·교환·반품 안내. 상품 상세와 /shipping-return이 같이 씁니다.
function Block({ section }: { section: PolicySection }) {
  return (
    <div style={{ marginTop: 26 }}>
      <h3 style={{ margin: 0, font: "700 14px 'Noto Sans KR',sans-serif", color: "#111" }}>{section.title}</h3>
      <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 13, lineHeight: 1.9, color: "#555" }}>
        {section.items.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  );
}

export default function ReturnPolicy() {
  return (
    <div>
      <Block section={SHIPPING_POLICY} />
      {RETURN_POLICY.map((s) => <Block key={s.title} section={s} />)}
      <div style={{ marginTop: 26, padding: "16px 20px", background: "#f7f3ef", fontSize: 13, lineHeight: 1.9, color: "#4a3b36" }}>
        <b>반품·교환 주소</b> {RETURN_ADDRESS}<br />
        <b>고객센터</b> {CS_TEXT}
      </div>
    </div>
  );
}
