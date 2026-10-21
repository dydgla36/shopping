import GuestLookup from "@/components/GuestLookup";
import { narrow, narrowTitle } from "@/lib/ui";

export const metadata = { title: "비회원 주문조회" };

export default function Page() {
  return (
    <section style={narrow(440)}>
      <h1 style={narrowTitle}>ORDER LOOKUP</h1>
      <p style={{ margin: "24px 0 0", fontSize: 13, lineHeight: 1.7, color: "#555", textAlign: "center" }}>비회원으로 주문하셨다면 주문자 이름과 주문 시 입력한 휴대전화 번호로 조회할 수 있어요.</p>
      <GuestLookup />
    </section>
  );
}
