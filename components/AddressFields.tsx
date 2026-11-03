"use client";

import { useEffect, useRef, useState } from "react";
import PhoneInput from "@/components/PhoneInput";

// 우편번호·주소 검색은 카카오(다음) 우편번호 서비스를 씁니다. (별도 가입이나 키가 필요 없어요)
type DaumAddress = { zonecode: string; roadAddress: string; jibunAddress: string; userSelectedType: "R" | "J" };
declare global {
  interface Window {
    daum?: { Postcode: new (o: { oncomplete: (d: DaumAddress) => void; width?: string; height?: string }) => { embed: (el: HTMLElement) => void } };
  }
}
function loadPostcode(): Promise<void> {
  if (window.daum?.Postcode) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("load"));
    document.head.appendChild(el);
  });
}

export type AddressInitial = { recipientName: string; recipientPhone: string; postcode: string; address: string; addressDetail: string };
export const EMPTY_ADDRESS: AddressInitial = { recipientName: "", recipientPhone: "", postcode: "", address: "", addressDetail: "" };

// 수령인·연락처·우편번호·주소·상세주소 입력칸. 주문/결제와 배송지 관리에서 같이 씁니다.
// 처음 채울 값(initial)을 바꾸려면 이 부품의 key를 바꿔서 다시 만들어 주세요.
export default function AddressFields({ initial = EMPTY_ADDRESS }: { initial?: AddressInitial }) {
  const [postcode, setPostcode] = useState(initial.postcode);
  const [address, setAddress] = useState(initial.address);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searching) return;
    let cancelled = false;
    loadPostcode()
      .then(() => {
        if (cancelled || !boxRef.current || !window.daum) return;
        boxRef.current.innerHTML = "";
        new window.daum.Postcode({
          oncomplete: (d) => {
            setPostcode(d.zonecode);
            setAddress(d.userSelectedType === "J" ? d.jibunAddress : d.roadAddress);
            setSearching(false);
          },
          width: "100%",
          height: "100%",
        }).embed(boxRef.current);
      })
      .catch(() => {
        setSearchError("주소 검색을 불러오지 못했어요. 주소를 직접 입력해 주세요.");
        setSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searching]);

  return (
    <>
      <label className="fld">수령인<input name="recipientName" type="text" defaultValue={initial.recipientName} placeholder="수령인 이름" required /></label>
      <label className="fld">연락처<PhoneInput name="recipientPhone" defaultValue={initial.recipientPhone} required /></label>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <label className="fld" style={{ flex: 1 }}>우편번호<input name="postcode" type="text" value={postcode} readOnly placeholder="주소 검색을 눌러 주세요" /></label>
        <button type="button" onClick={() => { setSearchError(""); setSearching(true); }} style={{ padding: "15px 18px", border: "1px solid #111", background: "#fff", color: "#111", font: "700 12px Archivo,sans-serif", letterSpacing: ".08em", cursor: "pointer", flex: "none" }}>주소 검색</button>
      </div>
      {searchError && <p role="alert" style={{ margin: "8px 0 0", fontSize: 12, color: "#c0392b" }}>{searchError}</p>}
      <label className="fld">주소<input name="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="주소 검색 후 자동으로 채워져요 (직접 입력도 가능)" required /></label>
      <label className="fld" style={{ marginTop: 10 }}><input name="addressDetail" type="text" defaultValue={initial.addressDetail} aria-label="상세주소" placeholder="상세주소를 입력하세요" /></label>
      {searching && (
        <div role="dialog" aria-modal="true" aria-label="주소 검색" style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 500, height: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #e5e5e5" }}>
              <b style={{ fontSize: 14 }}>주소 검색</b>
              <button type="button" onClick={() => setSearching(false)} style={{ border: 0, background: "none", color: "#111", fontSize: 14, cursor: "pointer" }}>닫기</button>
            </div>
            <div ref={boxRef} style={{ flex: 1, minHeight: 0 }} />
          </div>
        </div>
      )}
    </>
  );
}
