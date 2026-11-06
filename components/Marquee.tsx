import { FREE_SHIPPING_MIN, won } from "@/lib/orders";

// 맨 위 안내 띠: 문구가 천천히 흘러갑니다. 문구는 여기에서 바꾸세요.
const MESSAGES = [`${won(FREE_SHIPPING_MIN)} 이상 구매 시 무료배송`, "카카오 계정으로 3초 만에 가입하세요"];

export default function Marquee() {
  // 끊김 없이 이어지도록 같은 내용을 두 번 이어 붙입니다. (두 번째는 화면 읽기 프로그램이 읽지 않게 숨김)
  const half = Array.from({ length: 4 }, () => MESSAGES).flat();
  return (
    <div className="mq" role="region" aria-label="안내">
      <div className="mq-track">
        <div className="mq-half">{half.map((m, i) => <span key={i}>{m}</span>)}</div>
        <div className="mq-half" aria-hidden="true">{half.map((m, i) => <span key={i}>{m}</span>)}</div>
      </div>
    </div>
  );
}
