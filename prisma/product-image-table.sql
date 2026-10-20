-- 상품 이미지 파일을 DB에 저장하는 테이블 (Neon 콘솔 > SQL Editor에서 한 번만 실행)
-- 반드시 새 코드를 배포하기 "전에" 실행하세요.
-- (Product 테이블의 "imageUrl", "description" 컬럼이 아직 없다면 prisma/product-image.sql, prisma/product-description.sql도 먼저 실행하세요.)
CREATE TABLE "ProductImage" (
  "id" TEXT PRIMARY KEY,
  "mime" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "data" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
