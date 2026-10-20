-- 장바구니 테이블 (Neon 콘솔 > SQL Editor에서 한 번만 실행)
-- 반드시 새 코드를 배포하기 "전에" 실행하세요. (User, Product 테이블이 있어야 합니다)
CREATE TABLE "CartItem" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "productId" INTEGER NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "size" TEXT NOT NULL DEFAULT 'M',
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "CartItem_userId_productId_size_key" ON "CartItem"("userId", "productId", "size");
CREATE INDEX "CartItem_userId_idx" ON "CartItem"("userId");
