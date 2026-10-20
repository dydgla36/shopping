import ActionForm from "@/components/ActionForm";
import { requireAdmin } from "@/lib/admin";
import { runSetup } from "@/app/actions/setup";
import { SETUP_STATEMENTS } from "@/lib/setup";
import { h2 } from "../styles";

export default async function Page() {
  await requireAdmin("/admin/setup");
  return (
    <>
      <h2 style={h2}>DB 설정</h2>
      <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.8, color: "#555", maxWidth: 560 }}>
        새 기능(후기, 문의, 공지, 취소·반품·교환, 쿠폰, 적립금 등)에 필요한 테이블을 한 번에 만듭니다.
        코드를 올린 뒤 <b>이 버튼을 한 번 눌러 주세요.</b> 이미 만든 테이블은 건드리지 않고 건너뛰니, 여러 번 눌러도 안전합니다.
        (총 {SETUP_STATEMENTS.length}개 명령)
      </p>
      <div style={{ maxWidth: 420, marginTop: 8 }}>
        <ActionForm action={runSetup} submitLabel="테이블 만들기">
          <p style={{ margin: "16px 0 0", fontSize: 13, color: "#767676" }}>누르면 필요한 테이블만 추가됩니다. 기존 데이터는 삭제되지 않습니다.</p>
        </ActionForm>
      </div>
    </>
  );
}
