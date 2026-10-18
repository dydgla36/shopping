import Link from "next/link";

export default function Footer() {
  return (
    <footer className="foot" style={{ marginTop: 96, background: "#111", color: "#fff", padding: "56px 60px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
      <div>
        <div style={{ font: "800 28px Archivo,sans-serif", letterSpacing: ".08em" }}>GABBY</div>
        <div style={{ marginTop: 14, fontSize: 13, lineHeight: 1.8, color: "#cfcfcf" }}>
          [상호명] · 대표 [이름]<br />[사업자등록번호] · [통신판매업 신고번호]<br />[주소] · [고객센터 전화번호]
        </div>
      </div>
      <div>
        <Link href="/review">REVIEW</Link>
        <Link href="/qna">Q&amp;A</Link>
        <Link href="/notice">NOTICE</Link>
      </div>
      <div>
        <Link href="/mypage">마이 페이지</Link>
        <Link href="/login">로그인 / 회원가입</Link>
        <a href="#">이용약관 · 개인정보처리방침</a>
      </div>
    </footer>
  );
}
