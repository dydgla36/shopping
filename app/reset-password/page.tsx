import Link from "next/link";
import { createHash } from "node:crypto";
import ActionForm from "@/components/ActionForm";
import { prisma } from "@/lib/db";
import { resetPassword } from "@/app/actions/account";
import { narrow, narrowTitle } from "@/lib/ui";

export const metadata = { title: "비밀번호 재설정" };

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const reset = token ? await prisma.passwordReset.findUnique({ where: { tokenHash: createHash("sha256").update(token).digest("hex") } }).catch(() => null) : null;
  const valid = reset && !reset.usedAt && reset.expiresAt > new Date();

  return (
    <section style={narrow(440)}>
      <h1 style={narrowTitle}>RESET PASSWORD</h1>
      {valid ? (
        <ActionForm action={resetPassword} submitLabel="CHANGE PASSWORD">
          <input type="hidden" name="token" value={token} />
          <label className="fld">새 비밀번호 (영문, 숫자 포함 8자 이상)<input name="next" type="password" autoComplete="new-password" required /></label>
          <label className="fld">새 비밀번호 확인<input name="confirm" type="password" autoComplete="new-password" required /></label>
        </ActionForm>
      ) : (
        <p style={{ marginTop: 32, textAlign: "center", fontSize: 14, lineHeight: 1.8, color: "#555" }}>링크가 올바르지 않거나 만료되었어요.<br /><Link href="/find-pw" style={{ borderBottom: "1px solid #111", color: "#111" }}>비밀번호 찾기를 다시 진행하기</Link></p>
      )}
      <div style={{ textAlign: "center", marginTop: 28, fontSize: 13 }}><Link href="/login" style={{ color: "#555" }}>로그인으로 이동</Link></div>
    </section>
  );
}
