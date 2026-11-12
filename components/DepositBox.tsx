import { BANK } from "@/lib/business";
import { fmtDateTime, won } from "@/lib/orders";

// 무통장입금 안내: 입금 대기 중인 주문에만 보입니다.
export default function DepositBox({ order }: { order: { status: string; total: number; depositorName: string | null; depositDeadline: Date | null } }) {
  if (order.status !== "PENDING" || !order.depositDeadline) return null;
  return (
    <div role="status" style={{ marginTop: 20, padding: "20px 22px", border: "1px solid #111", background: "#fff", fontSize: 14, lineHeight: 1.9, textAlign: "left" }}>
      <b style={{ display: "block", marginBottom: 6 }}>아래 계좌로 입금해 주세요</b>
      {BANK.name} <b>{BANK.account}</b> (예금주 {BANK.holder})<br />
      입금 금액 <b>{won(order.total)}</b> · 입금자명 <b>{order.depositorName ?? "-"}</b><br />
      입금 기한 <b>{fmtDateTime(order.depositDeadline)}</b>까지. 기한 안에 입금이 확인되지 않으면 주문이 자동으로 취소돼요.
    </div>
  );
}
