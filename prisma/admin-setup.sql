-- 관리자 기능용 SQL (Neon 콘솔 > SQL Editor에서 한 번만 실행)
-- 반드시 새 코드를 배포하기 "전에" 실행하세요. (새 코드가 아래 컬럼을 읽습니다)

ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'USER';
ALTER TABLE "Order" ADD COLUMN "carrier" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingNumber" TEXT;

-- 관리자 계정: 아이디 admin / 비밀번호 admin
-- 비밀번호는 암호화된 값으로 들어갑니다. 로그인 후 관리자 > 관리자 계정에서 바로 바꾸세요.
INSERT INTO "User" ("loginId", "passwordHash", "name", "email", "phone", "role", "termsAgreedAt", "updatedAt")
VALUES ('admin', 'ed92730dd66b28db27c4447bd9e6f61e:b6ce0bf700a2824d5613d249fa795748ffd271566828b8235bc72a8de3af566f98ffb9b963aa714bf64694c69a2fb02c3b21170b5ae7458bb14b82d8bc399eaa', '관리자', 'admin@example.com', '000-0000-0000', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
