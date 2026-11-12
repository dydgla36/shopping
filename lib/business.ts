// 사업자 정보, 입금 계좌, 결제 수단. 푸터, 약관, 개인정보처리방침, 주문 완료 화면, 메일이 모두 여기 값을 씁니다.
// [대괄호] 부분을 실제 정보로 바꿔 주세요.
export const BUSINESS = {
  name: "[상호명]",
  ceo: "[대표자 이름]",
  regNo: "[사업자등록번호]",
  mailOrderNo: "[통신판매업 신고번호]",
  address: "[사업장 주소]",
  csPhone: "[고객센터 전화번호]",
  csEmail: "[고객센터 이메일]",
  csHours: "[운영시간 예: 평일 10:00~17:00, 점심 12:00~13:00, 주말·공휴일 휴무]",
  privacyOfficer: "[개인정보 보호책임자 이름 · 연락처]",
} as const;

// 무통장입금 계좌 (주문 완료 화면과 주문 접수 메일에 보여요)
export const BANK = { name: "[은행명]", account: "[계좌번호]", holder: "[예금주]" } as const;
export const DEPOSIT_HOURS = 72; // 주문 후 입금 기한 (시간). 지나면 자동 취소돼요.

// 지금 고를 수 있는 결제 수단. 카드 등 결제 서비스를 연결하면 여기에 추가합니다.
export const PAYMENT_METHODS = ["무통장입금"];
