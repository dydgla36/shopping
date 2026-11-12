import LegalDoc from "@/components/LegalDoc";
import { TERMS } from "@/lib/legal";

export const metadata = { title: "이용약관" };

export default function Page() {
  return <LegalDoc title="이용약관" sections={TERMS} />;
}
