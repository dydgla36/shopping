// 사이트가 쓰는 테이블·컬럼을 만드는 명령 모음입니다. 내용은 prisma/setup-statements.json에 있습니다.
// - 배포할 때(npm run build) scripts/db-setup.mjs가 자동으로 실행하고,
// - 관리자 > DB 설정의 "테이블 만들기" 버튼으로도 실행할 수 있습니다.
// 모두 "이미 있으면 건너뛰기" 방식이라 여러 번 실행해도 안전하고, 기존 데이터는 건드리지 않습니다. 한 문장씩 따로 실행합니다.
import statements from "../prisma/setup-statements.json";

export const SETUP_STATEMENTS: string[] = statements;
