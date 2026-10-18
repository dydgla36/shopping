-- 주문 테이블 추가용 SQL (Neon 콘솔 > SQL Editor에서 한 번만 실행)
-- 이미 Product, User 테이블이 만들어져 있어야 합니다.

CREATE TABLE "Order" (
  "id" SERIAL PRIMARY KEY,
  "orderNumber" TEXT NOT NULL,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "paymentMethod" TEXT NOT NULL,
  "itemsTotal" INTEGER NOT NULL,
  "shippingFee" INTEGER NOT NULL DEFAULT 0,
  "discount" INTEGER NOT NULL DEFAULT 0,
  "total" INTEGER NOT NULL,
  "ordererName" TEXT NOT NULL,
  "ordererPhone" TEXT NOT NULL,
  "ordererEmail" TEXT NOT NULL,
  "recipientName" TEXT NOT NULL,
  "recipientPhone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "addressDetail" TEXT,
  "deliveryMemo" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

CREATE TABLE "OrderItem" (
  "id" SERIAL PRIMARY KEY,
  "orderId" INTEGER NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "productId" INTEGER REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "name" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "color" TEXT,
  "size" TEXT
);
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
