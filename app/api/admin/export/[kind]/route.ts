import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { kstDateTime, toCsv } from "@/lib/csv";
import { CLAIM_STATUS, STATUS_LABEL, saleRate, unitPrice } from "@/lib/orders";
import { parseColors } from "@/lib/colors";
import { groupStock } from "@/lib/stock";
import { SIZES } from "@/lib/checkout";

// 관리자 전용: 주문·회원·상품 목록을 CSV(엑셀)로 내려받습니다. (개인정보가 들어 있어요)
const DAY = 24 * 3600 * 1000;
const yesNo = (v: boolean) => (v ? "예" : "아니오");

export async function GET(req: Request, { params }: { params: Promise<{ kind: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return new Response("권한이 없어요.", { status: 403 });
  const { kind } = await params;
  const today = kstDateTime(new Date()).slice(0, 10);
  let rows: (string | number | boolean | null)[][];

  if (kind === "orders") {
    const range = new URL(req.url).searchParams.get("range") ?? "30";
    const days = range === "all" ? 0 : [7, 30, 90, 365].includes(Number(range)) ? Number(range) : 30;
    const orders = await prisma.order.findMany({
      where: days ? { createdAt: { gte: new Date(Date.now() - days * DAY) } } : {},
      orderBy: { createdAt: "desc" },
      take: 20000,
      include: { items: true, user: { select: { loginId: true } } },
    });
    rows = [
      ["주문번호", "주문일시", "상태", "회원/비회원", "아이디", "주문자", "주문자 연락처", "이메일", "수령인", "수령인 연락처", "우편번호", "주소", "상세주소", "배송 메모", "택배사", "운송장 번호", "결제 수단", "주문 상품", "상품금액", "배송비", "할인(쿠폰+적립금)", "사용한 적립금", "결제금액", "취소한 사람", "취소 사유"],
      ...orders.map((o) => [
        o.orderNumber, kstDateTime(o.createdAt), STATUS_LABEL[o.status] ?? o.status, o.userId === null ? "비회원" : "회원", o.user?.loginId ?? "",
        o.ordererName, o.ordererPhone, o.ordererEmail, o.recipientName, o.recipientPhone, o.postcode ?? "", o.address, o.addressDetail ?? "", o.deliveryMemo ?? "",
        o.carrier ?? "", o.trackingNumber ?? "", o.paymentMethod,
        o.items.map((i) => `${i.name}${i.color || i.size ? ` (${[i.color, i.size].filter(Boolean).join("/")})` : ""} x${i.quantity}`).join("; "),
        o.itemsTotal, o.shippingFee, o.discount, o.pointsUsed, o.total, o.canceledBy === "CUSTOMER" ? "고객" : o.canceledBy === "ADMIN" ? "관리자" : "", o.cancelReason ?? "",
      ]),
    ];
  } else if (kind === "members") {
    const members = await prisma.user.findMany({ where: { role: "USER" }, orderBy: { createdAt: "desc" }, take: 20000, include: { _count: { select: { orders: true } } } });
    rows = [
      ["아이디", "이름", "이메일", "휴대전화", "가입일시", "마케팅 수신 동의", "가입 방법", "주문 수"],
      ...members.map((m) => [m.loginId, m.name, m.email, m.phone, kstDateTime(m.createdAt), yesNo(m.marketingOptIn), m.kakaoId ? "카카오" : "일반", m._count.orders]),
    ];
  } else if (kind === "products") {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 20000 });
    const stocks = groupStock(await prisma.productStock.findMany({ where: { productId: { in: products.map((p) => p.id) } } }));
    rows = [
      ["상품번호", "이름", "카테고리", "BEST 표시", "NEW 표시", "하위 분류", "정가", "할인율", "할인가", "품절 표시", ...SIZES.map((s) => `재고 ${s}`), "색상", "등록일시"],
      ...products.map((p) => [
        p.id, p.name, p.category, yesNo(p.inBest || p.category === "best"), yesNo(p.inNew || p.category === "new"), p.subCategory ?? "",
        p.price, saleRate(p.sale) ? `${saleRate(p.sale)}%` : "", unitPrice(p), yesNo(p.soldOut),
        ...SIZES.map((s) => stocks.get(p.id)?.[s] ?? "무제한"), parseColors(p.colors).map((c) => c.name).join("/"), kstDateTime(p.createdAt),
      ]),
    ];
  } else if (kind === "claims") {
    const claims = await prisma.claim.findMany({ orderBy: { createdAt: "desc" }, take: 20000, include: { user: { select: { loginId: true, name: true } }, order: { select: { orderNumber: true } } } });
    rows = [
      ["신청일시", "주문번호", "회원 아이디", "이름", "유형", "사유", "처리 상태", "처리 안내"],
      ...claims.map((c) => [kstDateTime(c.createdAt), c.order.orderNumber, c.user.loginId, c.user.name, c.type, c.reason, CLAIM_STATUS[c.status] ?? c.status, c.adminNote ?? ""]),
    ];
  } else {
    return new Response("알 수 없는 목록이에요.", { status: 404 });
  }

  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${kind}-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
