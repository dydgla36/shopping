// 이름 가운데를 가립니다. 김철수 → 김*수, 김철 → 김*
export function maskName(name: string) {
  const c = [...name];
  if (c.length <= 1) return name;
  if (c.length === 2) return `${c[0]}*`;
  return c[0] + "*".repeat(c.length - 2) + c[c.length - 1];
}

// 아이디 뒷부분을 가립니다. gabby12 → ga*****
export function maskLoginId(id: string) {
  const keep = Math.min(2, Math.max(1, id.length - 2));
  return id.slice(0, keep) + "*".repeat(Math.max(2, id.length - keep));
}

// 전화번호 가운데를 가립니다. 010-1234-5678 → 010-****-5678
export function maskPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.length >= 7 ? `${d.slice(0, 3)}-****-${d.slice(-4)}` : "****";
}

// 주소는 앞의 두 단어(시·구)만 보여줍니다. 서울 강남구 테헤란로 1 → 서울 강남구 ***
export function maskAddress(address: string) {
  return `${address.trim().split(/\s+/).slice(0, 2).join(" ")} ***`;
}
