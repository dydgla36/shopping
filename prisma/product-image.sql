-- 상품 이미지 주소 컬럼 추가 (Neon 콘솔 > SQL Editor에서 한 번만 실행)
-- 반드시 새 코드를 배포하기 "전에" 실행하세요.
ALTER TABLE "Product" ADD COLUMN "imageUrl" TEXT;
