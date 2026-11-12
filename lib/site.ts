// 사이트 주소 (검색 노출, 공유 미리보기, 사이트맵에 씁니다). 환경 변수 SITE_URL을 넣으면 그 값을 씁니다.
export const siteUrl = () =>
  (process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")).replace(/\/$/, "");
