import { headers } from "next/headers";

// 이메일 발송 (Resend 서비스). 환경 변수 RESEND_API_KEY, EMAIL_FROM이 있어야 동작합니다.
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

export async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, html }),
  });
  if (!res.ok) throw new Error(`이메일 발송 실패 (${res.status})`);
}

// 사이트 주소 (메일 안의 링크에 씁니다). 환경 변수 SITE_URL이 있으면 그 값을 씁니다.
export async function siteBase() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
}
