import Link from "next/link";
import ActionForm from "@/components/ActionForm";
import AddressFields, { EMPTY_ADDRESS } from "@/components/AddressFields";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteAddress, saveAddress, setDefaultAddress } from "@/app/actions/addresses";
import { MAX_ADDRESSES } from "@/lib/orders";
import { box, crumb, h1, lineBtn, pageWrap, subtitle } from "@/lib/ui";

export const metadata = { title: "배송지 관리" };

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const user = await requireUser("/addresses");
  const editId = Number((await searchParams).edit) || 0;
  const list = await prisma.address.findMany({ where: { userId: user.id }, orderBy: [{ isDefault: "desc" }, { id: "desc" }] });
  const editing = list.find((a) => a.id === editId);
  const full = !editing && list.length >= MAX_ADDRESSES;

  return (
    <>
      <div style={crumb}><Link href="/" style={{ color: "#767676" }}>HOME</Link> &gt; <Link href="/mypage" style={{ color: "#767676" }}>MY PAGE</Link> &gt; 배송지 관리</div>
      <section style={{ ...pageWrap, maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ ...h1, fontSize: 30 }}>ADDRESSES</h1>
        <p style={subtitle}>자주 쓰는 배송지를 저장해 두면 주문할 때 골라서 쓸 수 있어요. (최대 {MAX_ADDRESSES}개)</p>

        {list.length === 0 && <div style={{ padding: "32px 0", fontSize: 14, color: "#767676" }}>저장된 배송지가 없어요.</div>}
        {list.map((a) => (
          <div key={a.id} style={{ marginTop: 16, padding: 20, border: "1px solid #e5e5e5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <b style={{ fontSize: 15 }}>{a.label || a.recipientName}{a.isDefault && <span style={{ marginLeft: 8, padding: "2px 8px", background: "#111", color: "#fff", fontSize: 11 }}>기본 배송지</span>}</b>
              <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {!a.isDefault && <form action={setDefaultAddress}><input type="hidden" name="id" value={a.id} /><button type="submit" style={{ ...lineBtn, padding: "8px 14px" }}>기본으로</button></form>}
                <Link href={`/addresses?edit=${a.id}`} style={{ ...lineBtn, padding: "8px 14px" }}>수정</Link>
                <form action={deleteAddress}><input type="hidden" name="id" value={a.id} /><button type="submit" style={{ ...lineBtn, padding: "8px 14px", color: "#c0392b", borderColor: "#c0392b" }}>삭제</button></form>
              </span>
            </div>
            <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7, color: "#444" }}>
              {a.recipientName} · {a.recipientPhone}<br />
              {a.postcode ? `(${a.postcode}) ` : ""}{a.address}{a.addressDetail ? ` ${a.addressDetail}` : ""}
            </div>
          </div>
        ))}

        <div style={{ ...box, marginTop: 32 }}>
          <div style={{ font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>{editing ? "배송지 수정" : "새 배송지 추가"}</div>
          {full ? (
            <p style={{ margin: "12px 0 0", fontSize: 13, color: "#555" }}>배송지는 {MAX_ADDRESSES}개까지 저장할 수 있어요. 안 쓰는 배송지를 삭제한 뒤 추가해 주세요.</p>
          ) : (
            <ActionForm key={editing?.id ?? "new"} action={saveAddress} submitLabel={editing ? "저장" : "추가"}>
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <label className="fld">배송지 이름 (선택)<input name="label" type="text" maxLength={20} defaultValue={editing?.label ?? ""} placeholder="예: 집, 회사" /></label>
              <AddressFields initial={editing ? { recipientName: editing.recipientName, recipientPhone: editing.recipientPhone, postcode: editing.postcode ?? "", address: editing.address, addressDetail: editing.addressDetail ?? "" } : EMPTY_ADDRESS} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13, color: "#555" }}><input name="isDefault" type="checkbox" defaultChecked={editing?.isDefault ?? false} /> 기본 배송지로 사용</label>
            </ActionForm>
          )}
          {editing && <div style={{ marginTop: 12 }}><Link href="/addresses" style={{ fontSize: 13, borderBottom: "1px solid #111" }}>수정 취소</Link></div>}
        </div>
      </section>
    </>
  );
}
