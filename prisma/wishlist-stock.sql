-- 관심 상품, 사이즈별 재고 테이블 (Neon 콘솔 > SQL Editor에서 한 번만 실행)
-- 반드시 새 코드를 배포하기 "전에" 실행하세요. (User, Product 테이블이 있어야 합니다)
CREATE TABLE "WishlistItem" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "productId" INTEGER NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "WishlistItem_userId_productId_key" ON "WishlistItem"("userId", "productId");
CREATE INDEX "WishlistItem_userId_idx" ON "WishlistItem"("userId");

CREATE TABLE "ProductStock" (
  "id" SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "size" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX "ProductStock_productId_size_key" ON "ProductStock"("productId", "size");
