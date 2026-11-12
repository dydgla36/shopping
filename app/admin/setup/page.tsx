import ActionForm from "@/components/ActionForm";
import { requireAdmin } from "@/lib/admin";
import { runSetup } from "@/app/actions/setup";
import { cleanupDb } from "@/app/actions/maintenance";
import { prisma } from "@/lib/db";
import { SETUP_STATEMENTS } from "@/lib/setup";
import { h2 } from "../styles";

export default async function Page() {
  await requireAdmin("/admin/setup");
  // DB에 저장된 이미지 수와 크기 (DB 공간을 얼마나 쓰는지 가늠하는 용도)
  const usage = await prisma.productImage.aggregate({ _count: { _all: true }, _sum: { size: true } }).catch(() => null);
  const imageMb = (usage?._sum.size ?? 0) / 1024 / 1024;
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
      <h3 style={{ margin: "48px 0 0", font: "800 16px Archivo,'Noto Sans KR',sans-serif" }}>DB 정리</h3>
      <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.8, color: "#555", maxWidth: 560 }}>
        쓸모없어진 기록(만료된 로그인, 오래된 알림·오류 기록)과 <b>상품·후기 어디에서도 쓰지 않는 이미지</b>를 지워 DB 공간을 아껴요. 이미지는 DB에 저장하고 있어서 시간이 지나면 공간을 차지해요. 지금 저장된 이미지는 {usage ? `${usage._count._all}장, 약 ${imageMb.toFixed(1)}MB` : "확인할 수 없어요"}예요. 올린 지 하루가 지난 이미지만 지우고, 쓰고 있는 이미지는 지우지 않아요.
      </p>
      <div style={{ maxWidth: 420, marginTop: 8 }}>
        <ActionForm action={cleanupDb} submitLabel="불필요한 데이터 정리" confirmMessage="사용하지 않는 이미지와 오래된 기록을 지울까요?">
          <p style={{ margin: "16px 0 0", fontSize: 13, color: "#767676" }}>가끔(예: 한 달에 한 번) 눌러 주세요.</p>
        </ActionForm>
      </div>
    </>
  );
}
