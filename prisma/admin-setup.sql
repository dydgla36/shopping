-- 처음 한 번만: 관리자 계정(아이디 admin / 비밀번호 admin)을 만드는 SQL
-- Neon 콘솔 > SQL Editor에서 아래 두 문장을 "한 문장씩" 실행하세요. (한꺼번에 붙여넣으면 오류가 납니다)
-- 나머지 테이블은 로그인한 뒤 관리자 > DB 설정의 "테이블 만들기" 버튼이 만들어 줍니다.
-- 로그인 후에는 관리자 > 관리자 계정에서 비밀번호를 바로 바꾸세요.

-- 1번
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER';

-- 2번
INSERT INTO "User" ("loginId", "passwordHash", "name", "email", "phone", "role", "termsAgreedAt", "updatedAt")
VALUES ('admin', 'ed92730dd66b28db27c4447bd9e6f61e:b6ce0bf700a2824d5613d249fa795748ffd271566828b8235bc72a8de3af566f98ffb9b963aa714bf64694c69a2fb02c3b21170b5ae7458bb14b82d8bc399eaa', '관리자', 'admin@example.com', '000-0000-0000', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("loginId") DO NOTHING;
