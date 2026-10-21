export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// 전화번호 자동 하이픈: 숫자만 남기고 02(서울)와 그 밖의 번호를 나눠서 하이픈을 넣습니다.
// 01012345678 → 010-1234-5678, 0212345678 → 02-1234-5678, 031-123-4567
export function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.startsWith("02")) {
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
    if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`;
  }
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

// 숫자가 9~11자리인 전화번호 (하이픈은 있어도 됩니다)
export const phoneOk = (v: string) => /^[0-9-]+$/.test(v) && /^\d{9,11}$/.test(v.replace(/\D/g, ""));

// 비밀번호 규칙: 영문, 숫자를 포함해 8자 이상
export const passwordProblem = (v: string) => (v.length < 8 || !/[A-Za-z]/.test(v) || !/[0-9]/.test(v) ? "비밀번호는 영문, 숫자를 포함해 8자 이상이어야 해요." : null);
