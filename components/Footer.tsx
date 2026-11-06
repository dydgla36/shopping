import Link from "next/link";

// 소셜 링크는 환경 변수(INSTAGRAM_URL, YOUTUBE_URL, KAKAO_URL)를 넣으면 나타납니다.
const socials: [string, string | undefined][] = [
  ["INSTAGRAM", process.env.INSTAGRAM_URL],
  ["YOUTUBE", process.env.YOUTUBE_URL],
  ["KAKAO", process.env.KAKAO_URL],
];

export default function Footer() {
  return (
    <footer className="ft">
      <div className="ft-in">
        <div className="ft-brand">GABBY</div>
        <div className="ft-links">
          {/* 아래 세 항목은 약관 페이지를 만들면 링크로 바꿔 주세요. */}
          <span className="ft-todo">이용약관</span>
          <span className="ft-todo">개인정보처리방침</span>
          <span className="ft-todo">배송 안내</span>
          <Link href="/notice">NOTICE</Link>
          <Link href="/qna">Q&amp;A</Link>
          <Link href="/review">REVIEW</Link>
          {socials.filter(([, url]) => url).map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
          ))}
        </div>
        <div className="ft-biz">
          [상호명] · 대표 [이름] · 사업자등록번호 [번호] · 통신판매업 신고번호 [번호]<br />
          [주소] · 고객센터 [전화번호] · [이메일]
        </div>
        <div className="ft-copy">© GABBY. All rights reserved.</div>
      </div>
    </footer>
  );
}
