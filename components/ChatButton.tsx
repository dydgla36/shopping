// 카카오톡 상담 버튼: 환경 변수 KAKAO_URL(카카오톡 채널 주소)이 있을 때만 보입니다.
export default function ChatButton() {
  const url = process.env.KAKAO_URL;
  if (!url) return null;
  return (
    <a className="chat-btn" href={url} target="_blank" rel="noopener noreferrer" aria-label="카카오톡 상담">
      상담
    </a>
  );
}
