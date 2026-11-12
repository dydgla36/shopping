import Link from "next/link";
import { BUSINESS as B } from "@/lib/business";

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
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy"><b>개인정보처리방침</b></Link>
          <Link href="/shipping-return">배송·교환·반품</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/notice">NOTICE</Link>
          <Link href="/qna">Q&amp;A</Link>
          <Link href="/review">REVIEW</Link>
          {socials.filter(([, url]) => url).map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
          ))}
        </div>
        <div className="ft-biz">
          {B.name} · 대표 {B.ceo} · 사업자등록번호 {B.regNo} · 통신판매업 신고번호 {B.mailOrderNo}<br />
          {B.address} · 고객센터 {B.csPhone} · {B.csEmail}<br />
          {B.csHours}
        </div>
        <div className="ft-copy">© GABBY. All rights reserved.</div>
      </div>
    </footer>
  );
}
