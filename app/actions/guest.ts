"use server";

import { prisma } from "@/lib/db";
import { digits, limitedToken } from "@/lib/guest";
import { clearLimit, clientIp, lockedSeconds, recordFailure } from "@/lib/rateLimit";
import { STATUS_LABEL, fmtDate, won } from "@/lib/orders";

export type LookupResult = {
  error?: string;
  orders?: { orderNumber: string; date: string; summary: string; total: string; status: string; href: string }[];
};

const norm = (v: string) => v.replace(/\s+/g, "").toLowerCase();

// 비회원 주문 조회: 주문자 이름과 휴대전화 번호가 모두 맞는 비회원 주문을 보여줍니다.
// 이름과 번호는 남이 알 수도 있는 정보라서, 이렇게 조회한 화면에서는 배송지·연락처를 일부 가려서 보여줍니다.
// (전체 정보는 주문 완료 화면이나 메일의 링크로만 볼 수 있습니다.)
export async function lookupGuestOrders(formData: FormData): Promise<LookupResult> {
  const WINDOW = 15 * 60 * 1000;
  const key = `lookup:ip:${await clientIp()}`;
  const wait = await lockedSeconds(key);
  if (wait > 0) return { error: `조회 시도가 너무 많아요. ${Math.ceil(wait / 60)}분 뒤에 다시 시도해 주세요.` };

  const name = String(formData.get("name") ?? "").trim();
  const phone = digits(String(formData.get("phone") ?? ""));
  if (name.length < 2 || phone.length < 9) return { error: "주문자 이름과 휴대전화 번호를 입력해 주세요." };

  // 전화번호 뒤 4자리로 후보를 좁힌 뒤, 이름과 번호 전체가 맞는 주문만 고릅니다.
  const candidates = await prisma.order.findMany({
    where: { userId: null, ordererPhone: { contains: phone.slice(-4) } },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { items: true },
  });
  const mine = candidates.filter((o) => o.guestToken && digits(o.ordererPhone) === phone && norm(o.ordererName) === norm(name)).slice(0, 20);
  if (mine.length === 0) {
    await recordFailure(key, 5, WINDOW, WINDOW); // 5번 맞지 않으면 15분 동안 조회를 막습니다.
    return { error: "일치하는 비회원 주문이 없어요. 회원으로 주문했다면 로그인 후 마이페이지에서 확인해 주세요." };
  }
  await clearLimit(key);
  return {
    orders: mine.map((o) => ({
      orderNumber: o.orderNumber,
      date: fmtDate(o.createdAt),
      summary: `${o.items[0]?.name ?? "-"}${o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : ""}`,
      total: won(o.total),
      status: STATUS_LABEL[o.status] ?? o.status,
      href: `/guest-order?no=${encodeURIComponent(o.orderNumber)}&t=${limitedToken(o.guestToken as string)}`,
    })),
  };
}
