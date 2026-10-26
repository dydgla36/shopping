// 로그인 후 돌아갈 주소. 우리 사이트 안의 주소만 허용합니다.
export const safeNext = (n: string) => (n.startsWith("/") && !n.startsWith("//") && !n.startsWith("/\\") ? n : "/");
