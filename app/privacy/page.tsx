import LegalDoc from "@/components/LegalDoc";
import { PRIVACY } from "@/lib/legal";

export const metadata = { title: "개인정보처리방침" };

export default function Page() {
  return <LegalDoc title="개인정보처리방침" sections={PRIVACY} />;
}
