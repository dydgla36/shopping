"use client";

import { useState } from "react";
import ActionForm from "@/components/ActionForm";
import { createReview } from "@/app/actions/review";
import { uploadImage } from "@/lib/imageClient";
import { MAX_REVIEW_PHOTOS } from "@/lib/orders";

type Option = { productId: number; name: string };

// 후기 쓰기: 상품, 별점, 내용, 사진(최대 3장)
export default function ReviewForm({ options, defaultProduct }: { options: Option[]; defaultProduct: number }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const room = MAX_REVIEW_PHOTOS - photos.length;
    if (files.length === 0) return;
    if (room <= 0) return setMsg(`사진은 ${MAX_REVIEW_PHOTOS}장까지 붙일 수 있어요.`);
    setBusy(true);
    setMsg(null);
    const added: string[] = [];
    for (const file of files.slice(0, room)) {
      try {
        added.push(await uploadImage(file, "/api/upload/review"));
      } catch (err) {
        setMsg(err instanceof Error ? err.message : "업로드에 실패했어요.");
        break;
      }
    }
    if (added.length > 0) setPhotos((cur) => [...cur, ...added]);
    setBusy(false);
  }

  return (
    <ActionForm action={createReview} submitLabel="SUBMIT">
      <label className="fld">상품
        <select name="product" defaultValue={defaultProduct}>
          {options.map((o) => <option key={o.productId} value={o.productId}>{o.name}</option>)}
        </select>
      </label>
      <label className="fld">별점
        <select name="rating" defaultValue="5">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}{"☆".repeat(5 - n)} ({n}점)</option>)}
        </select>
      </label>
      <label className="fld">후기<textarea name="content" rows={7} maxLength={1000} placeholder="상품에 대한 후기를 5자 이상 남겨 주세요" required /></label>
      <div style={{ marginTop: 18, fontSize: 13 }}>
        <div style={{ fontWeight: 500 }}>사진 (선택, 최대 {MAX_REVIEW_PHOTOS}장)</div>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFiles} disabled={busy || photos.length >= MAX_REVIEW_PHOTOS} style={{ display: "block", marginTop: 8, fontSize: 13 }} />
        {busy && <div style={{ marginTop: 6, color: "#767676" }}>올리는 중...</div>}
        {msg && <div role="alert" style={{ marginTop: 6, color: "#c0392b" }}>{msg}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          {photos.map((url, i) => (
            <div key={url} style={{ width: 84 }}>
              <input type="hidden" name="photos" value={url} />
              <div style={{ aspectRatio: "1", overflow: "hidden", background: "#eee" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`후기 사진 ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <button type="button" onClick={() => setPhotos((cur) => cur.filter((_, n) => n !== i))} aria-label="사진 지우기" style={{ marginTop: 4, width: "100%", padding: "4px 0", border: "1px solid #ccc", background: "#fff", color: "#c0392b", cursor: "pointer", fontSize: 12 }}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </ActionForm>
  );
}
