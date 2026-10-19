-- 상품 설명 컬럼 추가 (Neon 콘솔 > SQL Editor에서 한 번만 실행)
-- 반드시 새 코드를 배포하기 "전에" 실행하세요.
-- (상품 이미지 컬럼 "imageUrl"을 아직 추가하지 않았다면 prisma/product-image.sql도 함께 실행하세요.)
ALTER TABLE "Product" ADD COLUMN "description" TEXT;
