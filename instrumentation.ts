// 서버에서 처리하지 못한 오류가 나면 Next.js가 이 함수를 불러 줍니다. 오류를 DB에 기록하고 관리자에게 알립니다.
// DB·이메일 도구는 Node.js 서버에서만 쓸 수 있어서, 그 환경일 때만(조건 안에서만) 불러옵니다.
export async function onRequestError(err: unknown, request: { path: string; method: string }) {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { reportError } = await import("./lib/errorLog");
    await reportError({ error: err, path: request.path, source: "server" });
  }
}
