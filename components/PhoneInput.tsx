"use client";

import { useState } from "react";
import { formatPhone } from "@/lib/validate";

// 입력하는 대로 하이픈(-)이 자동으로 들어가는 전화번호 입력칸입니다.
export default function PhoneInput({ name, defaultValue = "", placeholder = "010-0000-0000", required, autoComplete = "tel" }: { name: string; defaultValue?: string; placeholder?: string; required?: boolean; autoComplete?: string }) {
  const [value, setValue] = useState(formatPhone(defaultValue));
  return (
    <input
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete={autoComplete}
      placeholder={placeholder}
      required={required}
      maxLength={13}
      value={value}
      onChange={(e) => setValue(formatPhone(e.target.value))}
    />
  );
}
