export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const phoneOk = (v: string) => /^[0-9-]{9,13}$/.test(v);
// 비밀번호 규칙: 영문, 숫자를 포함해 8자 이상
export const passwordProblem = (v: string) => (v.length < 8 || !/[A-Za-z]/.test(v) || !/[0-9]/.test(v) ? "비밀번호는 영문, 숫자를 포함해 8자 이상이어야 해요." : null);
