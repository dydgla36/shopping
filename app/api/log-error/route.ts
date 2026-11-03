import { reportError } from "@/lib/errorLog";
import { clientIp, hit } from "@/lib/rateLimit";

// 고객의 브라우저에서 화면 오류가 났을 때 알려 주는 주소입니다. (같은 접속지에서 1시간에 20번까지)
export async function POST(req: Request) {
  if (!(await hit(`log-error:${await clientIp()}`, 20, 60 * 60 * 1000))) return new Response(null, { status: 204 });
  let body: { message?: unknown; path?: unknown; digest?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 204 });
  }
  const message = typeof body.message === "string" ? body.message.slice(0, 500) : "";
  if (!message) return new Response(null, { status: 204 });
  await reportError({
    error: new Error(message),
    path: typeof body.path === "string" ? body.path : null,
    digest: typeof body.digest === "string" ? body.digest.slice(0, 40) : undefined,
    source: "client",
  });
  return new Response(null, { status: 204 });
}
