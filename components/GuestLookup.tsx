"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import PhoneInput from "@/components/PhoneInput";
import { lookupGuestOrders, type LookupResult } from "@/app/actions/guest";

export default function GuestLookup() {
  const [result, setResult] = useState<LookupResult>();
  const [pending, setPending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setPending(true);
    startTransition(async () => {
      try {
        setResult(await lookupGuestOrders(data));
      } finally {
        setPending(false);
      }
    });
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label className="fld">주문자 이름<input name="name" type="text" autoComplete="name" placeholder="주문 시 입력한 이름" required /></label>
        <label className="fld">주문자 휴대전화<PhoneInput name="phone" required /></label>
        {result?.error && <p role="alert" style={{ margin: "16px 0 0", fontSize: 13, color: "#c0392b" }}>{result.error}</p>}
        <button className="btn" type="submit" disabled={pending} style={{ width: "100%", marginTop: 24, background: "#111", color: "#fff", border: 0, cursor: "pointer" }}>
          {pending ? "..." : "조회하기"}
        </button>
      </form>

      {result?.orders && (
        <div style={{ marginTop: 32 }}>
          <div style={{ paddingBottom: 12, borderBottom: "1px solid #111", font: "800 14px 'Noto Sans KR',sans-serif" }}>주문 {result.orders.length}건</div>
          {result.orders.map((o) => (
            <Link key={o.orderNumber} href={o.href} style={{ display: "block", padding: "16px 0", borderBottom: "1px solid #e5e5e5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, color: "#767676" }}><span>{o.date}</span><b style={{ color: "#111" }}>{o.status}</b></div>
              <div style={{ marginTop: 6, fontSize: 14 }}>{o.summary}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "#555" }}>{o.orderNumber} · {o.total}</div>
            </Link>
          ))}
          <p style={{ margin: "16px 0 0", fontSize: 12, lineHeight: 1.7, color: "#767676" }}>개인정보 보호를 위해 이 조회에서는 배송지와 연락처를 일부만 보여줘요. 전체 정보는 주문 완료 화면이나 주문 확인 메일의 링크에서 볼 수 있어요.</p>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 28, fontSize: 13 }}>
        <Link href="/login" style={{ color: "#555" }}>회원 로그인</Link>
        <Link href="/mypage" style={{ color: "#555" }}>마이페이지</Link>
      </div>
    </>
  );
}
