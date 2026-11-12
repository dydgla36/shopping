"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/imageClient";
import { MAX_DETAIL_BLOCKS, MAX_DETAIL_IMAGES, parseDetail, type DetailBlock } from "@/lib/productContent";

const small = { padding: "6px 10px", border: "1px solid #ccc", background: "#fff", color: "#111", cursor: "pointer", fontSize: 12 } as const;

// 상품 상세 내용 편집기: 글과 이미지를 원하는 순서로 쌓아 올립니다. 저장하면 상품 상세 페이지에 순서대로 보여요.
export default function DetailEditor({ initial }: { initial: string | null }) {
  const [blocks, setBlocks] = useState<DetailBlock[]>(parseDetail(initial));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const images = blocks.filter((b) => b.t === "image").length;

  const edit = (i: number, v: string) => setBlocks((cur) => cur.map((b, n) => (n === i ? { ...b, v } : b)));
  const remove = (i: number) => setBlocks((cur) => cur.filter((_, n) => n !== i));
  const move = (i: number, dir: -1 | 1) =>
    setBlocks((cur) => {
      const next = [...cur];
      [next[i], next[i + dir]] = [next[i + dir] as DetailBlock, next[i] as DetailBlock];
      return next;
    });

  async function addImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setBusy(true);
    setMsg(null);
    const added: DetailBlock[] = [];
    for (const file of files) {
      if (blocks.length + added.length >= MAX_DETAIL_BLOCKS) return void setMsg(`항목은 ${MAX_DETAIL_BLOCKS}개까지 넣을 수 있어요.`);
      if (images + added.length >= MAX_DETAIL_IMAGES) {
        setMsg(`이미지는 ${MAX_DETAIL_IMAGES}장까지 넣을 수 있어요.`);
        break;
      }
      try {
        added.push({ t: "image", v: await uploadImage(file) });
      } catch (err) {
        setMsg(err instanceof Error ? err.message : "업로드에 실패했어요.");
        break;
      }
    }
    if (added.length > 0) setBlocks((cur) => [...cur, ...added]);
    setBusy(false);
  }

  // 비어 있는 글 칸은 저장하지 않습니다.
  const json = JSON.stringify(blocks.filter((b) => b.v.trim()));

  return (
    <fieldset style={{ border: 0, padding: 0, margin: "18px 0 0", fontSize: 12, color: "#767676" }}>
      <legend style={{ padding: 0 }}>상품 상세 내용 (선택) — 글과 이미지를 원하는 순서로 넣어요. 상품 상세 페이지 아래쪽에 위에서부터 차례로 보여요.</legend>
      <input type="hidden" name="detail" value={json} />
      {blocks.map((b, i) => (
        <div key={i} style={{ marginTop: 10, padding: 12, border: "1px solid #e5e5e5", background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8, color: "#111", fontWeight: 700 }}>
            <span>{b.t === "image" ? "이미지" : "글"} {i + 1}</span>
            <span style={{ display: "flex", gap: 4 }}>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="위로" style={small}>↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label="아래로" style={small}>↓</button>
              <button type="button" onClick={() => remove(i)} aria-label="삭제" style={{ ...small, color: "#c0392b" }}>삭제</button>
            </span>
          </div>
          {b.t === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.v} alt="" style={{ display: "block", maxWidth: 240, maxHeight: 240, width: "auto", height: "auto" }} />
          ) : (
            <textarea value={b.v} rows={4} maxLength={5000} onChange={(e) => edit(i, e.target.value)} aria-label={`글 ${i + 1}`} placeholder="상품 설명, 소재, 세탁 방법, 모델 착용 정보 등을 적어 주세요. 줄바꿈이 그대로 보여요." style={{ width: "100%", boxSizing: "border-box", padding: 10, border: "1px solid #ccc", font: "400 14px/1.7 'Noto Sans KR',sans-serif", resize: "vertical" }} />
          )}
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
        <button type="button" onClick={() => setBlocks((cur) => (cur.length >= MAX_DETAIL_BLOCKS ? cur : [...cur, { t: "text", v: "" }]))} style={{ ...small, padding: "10px 16px" }}>+ 글 추가</button>
        <label style={{ ...small, padding: "10px 16px", display: "inline-block" }}>
          + 이미지 추가 (여러 장 가능)
          <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={addImages} disabled={busy} style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} />
        </label>
        {busy && <span>올리는 중...</span>}
        <span>글 {blocks.length - images}개 · 이미지 {images}/{MAX_DETAIL_IMAGES}장</span>
      </div>
      {msg && <div role="alert" style={{ marginTop: 8, color: "#c0392b" }}>{msg}</div>}
    </fieldset>
  );
}
