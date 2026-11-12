import { prisma } from "@/lib/db";
import { cancelOrderTx } from "@/lib/orderOps";
import { notifyOrder } from "@/lib/notify";
import { sendRestockAlerts } from "@/lib/restock";

// 하루에 한 번 Vercel이 부르는 정리 작업입니다. (vercel.json의 crons)
// - 입금 기한이 지난 무통장입금 주문을 자동으로 취소합니다.
// 보안: 환경 변수 CRON_SECRET이 있어야 하고, 요청 헤더가 같아야만 실행됩니다. (Vercel이 자동으로 붙여 줍니다)
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return Response.json({ error: "CRON_SECRET이 설정되지 않았어요." }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "권한이 없어요." }, { status: 401 });

  const reason = "입금 기한이 지나 자동으로 취소되었어요.";
  const overdue = await prisma.order.findMany({ where: { status: "PENDING", depositDeadline: { lt: new Date() } }, include: { items: true }, take: 200 });
  let canceled = 0;
  for (const o of overdue) {
    try {
      await prisma.$transaction((tx) => cancelOrderTx(tx, o.id, { by: "ADMIN", reason }));
      canceled += 1;
      await notifyOrder("canceled", { ...o, reason });
      await sendRestockAlerts(o.items.map((i) => i.productId));
    } catch (e) {
      console.error("미입금 주문 자동 취소 실패:", o.orderNumber, e);
    }
  }
  return Response.json({ canceled, checked: overdue.length });
}
