"use client";

import Link from "next/link";
import PhoneInput from "@/components/PhoneInput";
import { startTransition, useActionState, useState } from "react";
import AddressFields, { EMPTY_ADDRESS, type AddressInitial } from "@/components/AddressFields";
import { createOrder } from "@/app/actions/order";
import { couponDiscount, couponText, couponUsable } from "@/lib/coupons";
import { FREE_SHIPPING_MIN, untilFreeShipping, won } from "@/lib/orders";

type Item = { name: string; option: string; quantity: number; priceText: string; bg: string };
type SavedAddress = { id: number; label: string | null; recipientName: string; recipientPhone: string; postcode: string | null; address: string; addressDetail: string | null; isDefault: boolean };
type Coupon = { id: number; name: string; kind: string; value: number; minOrder: number };
type Props = {
  items: Item[];
  itemsTotal: number;
  shipping: number;
  balance: number;
  coupons: Coupon[];
  addresses: SavedAddress[];
  defaults: { name: string; phone: string; email: string };
  hidden: { productId: string; size: string; qty: string; color: string; cart: string };
  guest: boolean;
  loginHref: string;
};

const heading = { font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" } as const;
const sec = { marginTop: 44, paddingBottom: 14, borderBottom: "1px solid #111", ...heading } as const;
const row = { display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 14 } as const;

export default function CheckoutForm({ items, itemsTotal, shipping, balance, coupons, addresses, defaults, hidden, guest, loginHref }: Props) {
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

  // 저장된 배송지 고르기 (고르면 아래 입력칸이 그 배송지로 다시 채워집니다)
  const defaultAddr = addresses.find((x) => x.isDefault) ?? addresses[0];
  const [addrId, setAddrId] = useState(defaultAddr ? String(defaultAddr.id) : "");
  const picked = addresses.find((x) => String(x.id) === addrId);
  const initialAddress: AddressInitial = picked
    ? { recipientName: picked.recipientName, recipientPhone: picked.recipientPhone, postcode: picked.postcode ?? "", address: picked.address, addressDetail: picked.addressDetail ?? "" }
    : EMPTY_ADDRESS;

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 56, marginTop: 8, alignItems: "start" }}>
      <div>
        <input type="hidden" name="productId" value={hidden.productId} />
        <input type="hidden" name="size" value={hidden.size} />
        <input type="hidden" name="qty" value={hidden.qty} />
        <input type="hidden" name="color" value={hidden.color} />
        <input type="hidden" name="cart" value={hidden.cart} />
        {guest && (
          <div style={{ marginTop: 8, padding: "14px 16px", background: "#f4f2ee", fontSize: 13, lineHeight: 1.7, color: "#444" }}>
            비회원으로 주문하는 중이에요. 주문 조회는 주문번호와 휴대전화 번호로 할 수 있어요.<br />
            로그인하면 쿠폰·적립금을 쓸 수 있어요. <Link href={loginHref} style={{ borderBottom: "1px solid #111", color: "#111" }}>로그인하기</Link>
          </div>
        )}
        <div style={sec}>주문자 정보</div>
        <label className="fld">이름<input name="ordererName" type="text" defaultValue={defaults.name} placeholder="이름을 입력하세요" required /></label>
        <label className="fld">휴대전화<PhoneInput name="ordererPhone" defaultValue={defaults.phone} required /></label>
        <label className="fld">이메일<input name="ordererEmail" type="email" defaultValue={defaults.email} placeholder="example@email.com" required /></label>

        <div style={sec}>배송 정보</div>
        {!guest && addresses.length > 0 && (
          <label className="fld">저장된 배송지
            <select value={addrId} onChange={(e) => setAddrId(e.target.value)}>
              <option value="">직접 입력</option>
              {addresses.map((x) => <option key={x.id} value={x.id}>{x.label || x.recipientName}{x.isDefault ? " (기본)" : ""} · {x.address}</option>)}
            </select>
          </label>
        )}
        <AddressFields key={addrId} initial={initialAddress} />
        <label className="fld">배송 메모<input name="deliveryMemo" type="text" placeholder="배송 시 요청사항" /></label>
        {!guest && !picked && <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13, color: "#555" }}><input name="saveAddress" type="checkbox" /> 이 배송지를 저장해 두기</label>}

        {!guest && (
          <>
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
          </>
        )}

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
        <div style={row}><span>배송비</span><span>{shipping === 0 ? "무료" : won(shipping)}</span></div>
        {untilFreeShipping(itemsTotal) > 0 && <div style={{ marginTop: 6, fontSize: 12, color: "#c0392b" }}>{won(untilFreeShipping(itemsTotal))} 더 담으면 배송비 무료 ({won(FREE_SHIPPING_MIN)} 이상)</div>}
        {!guest && <div style={row}><span>쿠폰 할인</span><span>− {won(couponOff)}</span></div>}
        {!guest && <div style={row}><span>적립금 사용</span><span>− {won(points)}</span></div>}
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
