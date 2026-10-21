import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import { lookupGuestOrder } from "@/app/actions/guest";
import { narrow, narrowTitle } from "@/lib/ui";

export const metadata = { title: "비회원 주문조회" };

export default function Page() {
  return (
    <section style={narrow(440)}>
      <h1 style={narrowTitle}>ORDER LOOKUP</h1>
      <p style={{ margin: "24px 0 0", fontSize: 13, lineHeight: 1.7, color: "#555", textAlign: "center" }}>비회원으로 주문하셨다면 주문번호와 주문 시 입력한 휴대전화 번호로 조회할 수 있어요.</p>
      <ActionForm action={lookupGuestOrder} submitLabel="조회하기">
        <label className="fld">주문번호<input name="orderNumber" type="text" placeholder="예: G20260101-12345" autoCapitalize="characters" required /></label>
        <label className="fld">주문자 휴대전화<input name="phone" type="tel" placeholder="010-0000-0000" required /></label>
      </ActionForm>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 28, fontSize: 13 }}>
        <Link href="/login" style={{ color: "#555" }}>회원 로그인</Link>
        <Link href="/mypage" style={{ color: "#555" }}>마이페이지</Link>
      </div>
    </section>
  );
}
