// 주문 상세 화면들(회원, 비회원, 관리자)이 같이 쓰는 "항목: 값" 줄과 구역 제목입니다.
export const line = { display: "flex", justifyContent: "space-between", gap: 20, padding: "14px 0", borderBottom: "1px solid #e5e5e5", fontSize: 14 } as const;

export const Row = ({ a, b }: { a: string; b: React.ReactNode }) => (
  <div style={line}><span style={{ color: "#767676", flexShrink: 0 }}>{a}</span><span style={{ textAlign: "right" }}>{b}</span></div>
);

export const Title = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginTop: 36, paddingBottom: 14, borderBottom: "1px solid #111", font: "800 16px Archivo,'Noto Sans KR',sans-serif", letterSpacing: ".06em" }}>{children}</div>
);
