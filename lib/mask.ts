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
