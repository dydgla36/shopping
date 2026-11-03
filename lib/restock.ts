import { prisma } from "@/lib/db";
import { emailConfigured, sendEmail, siteBase } from "@/lib/email";
import { esc } from "@/lib/html";
import { groupStock } from "@/lib/stock";

// 재입고 알림: 품절이던 상품(사이즈)이 다시 살 수 있게 되면, 신청한 사람에게 이메일을 보냅니다.
// 재고를 바꾸거나 품절을 해제하거나 주문이 취소돼 재고가 돌아올 때 부릅니다.
// 이메일 서비스가 없으면 신청을 그대로 두어서, 서비스를 연결한 뒤 다음 재고 변화 때 보냅니다.
export async function sendRestockAlerts(productIds: (number | null)[]) {
  const ids = Array.from(new Set(productIds.filter((n): n is number => typeof n === "number")));
  if (ids.length === 0 || !emailConfigured()) return;
  try {
    const alerts = await prisma.restockAlert.findMany({
      where: { productId: { in: ids }, notifiedAt: null },
      include: { product: { select: { id: true, name: true, soldOut: true, sizes: true } } },
    });
    if (alerts.length === 0) return;
    const stocks = groupStock(await prisma.productStock.findMany({ where: { productId: { in: ids } } }));
    const base = await siteBase();
    for (const a of alerts) {
      if (a.product.soldOut) continue;
      const st = stocks.get(a.productId) ?? {};
      // 재고 기록이 없는 사이즈는 재고를 관리하지 않는 것(무제한)이라 살 수 있습니다.
      const available = a.size ? st[a.size] !== 0 : a.product.sizes.some((s) => st[s] !== 0);
      if (!available) continue;
      try {
        await sendEmail(a.email, `[GABBY] 재입고 알림: ${a.product.name}`, `<p>신청하신 상품이 다시 입고되었어요.</p><p><b>${esc(a.product.name)}</b>${a.size ? ` (${esc(a.size)})` : ""}</p><p><a href="${base}/product/${a.product.id}">상품 보러 가기</a></p><p style="color:#888;font-size:12px">재고가 많지 않을 수 있어요. 알림은 한 번만 보내드려요.</p>`);
        await prisma.restockAlert.update({ where: { id: a.id }, data: { notifiedAt: new Date() } });
      } catch (e) {
        console.error("재입고 알림 메일 실패:", e);
      }
    }
  } catch (e) {
    console.error("재입고 알림 처리 실패:", e);
  }
}
