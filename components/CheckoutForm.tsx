"use client";

import { startTransition, useActionState, useState } from "react";
import { createOrder } from "@/app/actions/order";
import { couponDiscount, couponText, couponUsable } from "@/lib/coupons";
import { won } from "@/lib/orders";

type Item = { name: string; option: string; quantity: number; priceText: string; bg: string };
type Coupon = { id: number; name: string; kind: string; value: number; minOrder: number };
type Props = {
  items: Item[];
  itemsTotal: number;
  shipping: number;
  balance: number;
  coupons: Coupon[];
  defaults: { name: string; phone: string; email: string };
  hidden: { productId: string; size: string; qty: string; cart: string };
};

const heading = { font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" } as const;
const sec = { marginTop: 44, paddingBottom: 14, borderBottom: "1px solid #111", ...heading } as const;
const row = { display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 14 } as const;

export default function CheckoutForm({ items, itemsTotal, shipping, balance, coupons, defaults, hidden }: Props) {
  const [state, action, pending] = useActionState(createOrder, undefined);
  // 오류가 나도 입력한 내용이 지워지지 않도록 직접 제출합니다.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }
  // 화면의 금액은 미리 계산해서 보여주는 것이고, 실제 금액은 서버가 다시 계산합니다.
  const [couponId, setCouponId] = useState("");
  const [pointsText, setPointsText] = useState("");
  const coupon = coupons.find((c) => String(c.id) === couponId);
  const couponOff = coupon && couponUsable(coupon, itemsTotal) ? couponDiscount(coupon, itemsTotal) : 0;
  const maxPoints = Math.max(0, Math.min(balance, itemsTotal - couponOff));
  const points = Math.min(maxPoints, Math.max(0, Math.floor(Number(pointsText)) || 0));
  const totalText = won(itemsTotal + shipping - couponOff - points);

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 56, marginTop: 8, alignItems: "start" }}>
      <div>
        <input type="hidden" name="productId" value={hidden.productId} />
        <input type="hidden" name="size" value={hidden.size} />
        <input type="hidden" name="qty" value={hidden.qty} />
        <input type="hidden" name="cart" value={hidden.cart} />
        <div style={sec}>주문자 정보</div>
        <label className="fld">이름<input name="ordererName" type="text" defaultValue={defaults.name} placeholder="이름을 입력하세요" required /></label>
        <label className="fld">휴대전화<input name="ordererPhone" type="tel" defaultValue={defaults.phone} placeholder="010-0000-0000" required /></label>
        <label className="fld">이메일<input name="ordererEmail" type="email" defaultValue={defaults.email} placeholder="example@email.com" required /></label>

        <div style={sec}>배송 정보</div>
        <label className="fld">수령인<input name="recipientName" type="text" placeholder="수령인 이름" required /></label>
        <label className="fld">연락처<input name="recipientPhone" type="tel" placeholder="010-0000-0000" required /></label>
        <label className="fld">주소<input name="address" type="text" placeholder="주소를 입력하세요" required /></label>
        <label className="fld" style={{ marginTop: 10 }}><input name="addressDetail" type="text" aria-label="상세주소" placeholder="상세주소를 입력하세요" /></label>
        <label className="fld">배송 메모<input name="deliveryMemo" type="text" placeholder="배송 시 요청사항" /></label>

        <div style={sec}>쿠폰 · 적립금</div>
        <label className="fld">쿠폰
          <select name="userCouponId" value={couponId} onChange={(e) => setCouponId(e.target.value)}>
            <option value="">사용 안 함</option>
            {coupons.map((c) => (
              <option key={c.id} value={c.id} disabled={!couponUsable(c, itemsTotal)}>
                {c.name} ({couponText(c)}){c.minOrder > 0 ? ` · ${won(c.minOrder)} 이상` : ""}{!couponUsable(c, itemsTotal) ? " · 사용 불가" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="fld">적립금 (보유 {won(balance)}, 최대 {won(maxPoints)}까지 사용)
          <input name="points" type="number" min={0} max={maxPoints} value={pointsText} onChange={(e) => setPointsText(e.target.value)} placeholder="0" />
        </label>

        <div style={sec}>결제 수단</div>
        <div style={{ marginTop: 20 }}>
          {["신용카드", "계좌이체", "무통장입금", "카카오페이"].map((m, i) => (
            <span key={m}>
              <input className="opt" type="radio" name="pay" id={`p${i}`} value={m} defaultChecked={i === 0} />
              <label htmlFor={`p${i}`}>{m}</label>
            </span>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 32, fontSize: 13, color: "#333" }}>
          <input name="agree" type="checkbox" /> 주문 내용을 확인했으며 결제에 동의합니다
        </label>
      </div>

      <div style={{ background: "#f4f2ee", padding: 32, maxWidth: 460 }}>
        <div style={heading}>ORDER SUMMARY</div>
        {items.map((it) => (
          <div key={it.name} style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ aspectRatio: "4/5", background: it.bg }} />
            <div>
              <div style={{ fontSize: 14 }}>{it.name}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: "#767676" }}>{[it.option, `수량 ${it.quantity}`].filter(Boolean).join(" / ")}</div>
            </div>
            <div style={{ font: "800 14px Archivo,sans-serif" }}>{it.priceText}</div>
          </div>
        ))}
        <div style={row}><span>상품금액</span><span>{won(itemsTotal)}</span></div>
        <div style={row}><span>배송비</span><span>{won(shipping)}</span></div>
        <div style={row}><span>쿠폰 할인</span><span>− {won(couponOff)}</span></div>
        <div style={row}><span>적립금 사용</span><span>− {won(points)}</span></div>
        <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid #111" }}>
          <div style={{ ...row, marginTop: 0, fontWeight: 700 }}><span>총 결제금액</span><span>{totalText}</span></div>
        </div>
        {state?.error && <p role="alert" style={{ margin: "16px 0 0", fontSize: 13, color: "#c0392b" }}>{state.error}</p>}
        <button className="btn" type="submit" disabled={pending} style={{ width: "100%", marginTop: 28, background: "#111", color: "#fff", border: 0, cursor: "pointer" }}>
          {pending ? "..." : `PAY ${totalText}`}
        </button>
        <div style={{ marginTop: 14, fontSize: 12, color: "#767676", lineHeight: 1.7 }}>실제 결제는 아직 연결되어 있지 않아, 주문은 &apos;주문 접수&apos; 상태로 저장됩니다.</div>
      </div>
    </form>
  );
}
