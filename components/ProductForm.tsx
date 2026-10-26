"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { createProduct, updateProduct } from "@/app/actions/admin";
import ProductCard from "@/components/ProductCard";
import { priceView, unitPrice, won } from "@/lib/orders";
import { SUB_CATEGORIES } from "@/lib/categories";
import { MAX_COLORS, parseColors, type ColorOption } from "@/lib/colors";
import { btnDark, input, notice } from "@/app/admin/styles";

const COLORS = ["#e6e3de", "#ddd8d0", "#d6d6d6", "#dcdcdc", "#e8dcd2", "#d9e0e3"];
const MAX_ORIGINAL = 20 * 1024 * 1024; // 고를 수 있는 원본 파일 크기
const MAX_UPLOAD = 2 * 1024 * 1024; // 서버로 보내는 파일 크기 (줄인 뒤)

// 올리기 전에 이미지를 줄입니다. (가로 1200px 이하, JPEG) 움직이는 GIF와 이미 작은 파일은 그대로 올립니다.
async function prepare(file: File): Promise<Blob | null> {
  if (file.type === "image/gif" && file.size <= MAX_UPLOAD) return file;
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("이미지를 읽을 수 없어요. 다른 파일로 시도해 주세요.");
  });
  try {
    if (bitmap.width <= 1200 && file.size <= 700 * 1024) return file;
    for (const [width, quality] of [[1200, 0.85], [900, 0.75], [600, 0.7]] as const) {
      const scale = Math.min(1, width / bitmap.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#fff"; // 투명한 부분은 흰색으로
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (blob && blob.size <= MAX_UPLOAD) return blob;
    }
    return null;
  } finally {
    bitmap.close();
  }
}
const MAX_EXTRA = 5; // 추가 이미지 최대 장수

// 이미지 파일 한 장을 줄여서 올리고, 저장된 이미지 주소를 돌려줍니다.
async function uploadImage(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new Error("JPG, PNG, WEBP, GIF 파일만 올릴 수 있어요.");
  if (file.size > MAX_ORIGINAL) throw new Error("원본 파일은 20MB 이하여야 해요.");
  const prepared = await prepare(file).catch(() => null);
  if (!prepared) throw new Error("이미지를 읽을 수 없거나, 줄여도 2MB를 넘어요.");
  const fd = new FormData();
  fd.append("file", prepared, "upload");
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (res.status === 413) throw new Error("이미지가 너무 커요. 더 작은 이미지를 올려 주세요.");
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "업로드에 실패했어요.");
  return data.url;
}

const smallBtn = { flex: 1, padding: "4px 0", border: "1px solid #ccc", background: "#fff", color: "#111", cursor: "pointer", fontSize: 12 } as const;
const label = { display: "block", marginTop: 18, fontSize: 12, color: "#767676" } as const;

export type ProductInit = { id: number; category: string; name: string; price: number; sale: string | null; position: number; bg: string; imageUrl: string | null; description: string | null; subCategory: string | null; inBest: boolean; inNew: boolean; soldOut: boolean; extraImages: string[]; colors: string[]; stock: Record<string, number> };

// 상품 추가(product 없음)와 상품 수정(product 있음)에 같이 씁니다.
export default function ProductForm({ product }: { categories?: string[]; product?: ProductInit }) {
  const [state, action, pending] = useActionState(product ? updateProduct : createProduct, undefined);
  // 입력값을 상태로 들고 있어서, 오류가 나도 입력한 내용이 지워지지 않고 미리보기에도 바로 반영됩니다.
  const [v, setV] = useState({
    name: product?.name ?? "",
    price: product ? String(product.price) : "",
    sale: (product?.sale ?? "").replace("%", ""),
    position: product ? String(product.position) : "",
    bg: product?.bg ?? COLORS[0],
    imageUrl: product?.imageUrl ?? "",
    description: product?.description ?? "",
    subCategory: product?.subCategory ?? "",
    stockS: product && product.stock.S !== undefined ? String(product.stock.S) : "",
    stockM: product && product.stock.M !== undefined ? String(product.stock.M) : "",
    stockL: product && product.stock.L !== undefined ? String(product.stock.L) : "",
  });
  // 카테고리: 모든 상품은 WOMEN에 들어가고, BEST·NEW에도 표시할지 고릅니다. 품절 표시도 여기서 정합니다.
  const [flags, setFlags] = useState({ inBest: product?.inBest ?? false, inNew: product?.inNew ?? false, soldOut: product?.soldOut ?? false });
  const toggle = (k: keyof typeof flags) => () => setFlags((f) => ({ ...f, [k]: !f[k] }));
  const chipStyle = (on: boolean) => ({ display: "inline-block", padding: "10px 16px", border: `1px solid ${on ? "#111" : "#ccc"}`, background: on ? "#111" : "#fff", color: on ? "#fff" : "#111", cursor: "pointer", font: "500 13px 'Noto Sans KR',sans-serif" }) as const;
  const hiddenInput = { position: "absolute", opacity: 0, width: 1, height: 1 } as const;

  // 추가 이미지(최대 5장)와 색상 옵션(최대 8개)
  const [extra, setExtra] = useState<string[]>(product?.extraImages ?? []);
  const [extraBusy, setExtraBusy] = useState(false);
  const [extraMsg, setExtraMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [colorRows, setColorRows] = useState<ColorOption[]>(parseColors(product?.colors ?? []));
  const moveExtra = (i: number, dir: -1 | 1) =>
    setExtra((cur) => {
      const next = [...cur];
      [next[i], next[i + dir]] = [next[i + dir] as string, next[i] as string];
      return next;
    });
  async function onExtraFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const room = MAX_EXTRA - extra.length;
    if (room <= 0) return setExtraMsg({ ok: false, text: `추가 이미지는 ${MAX_EXTRA}장까지예요.` });
    setExtraBusy(true);
    setExtraMsg(null);
    const added: string[] = [];
    let failed: string | null = null;
    for (const file of files.slice(0, room)) {
      try {
        added.push(await uploadImage(file));
      } catch (err) {
        failed = err instanceof Error ? err.message : "업로드에 실패했어요.";
        break;
      }
    }
    if (added.length > 0) setExtra((cur) => [...cur, ...added]);
    setExtraBusy(false);
    setExtraMsg(failed ? { ok: false, text: failed } : { ok: true, text: files.length > room ? `${MAX_EXTRA}장까지만 올렸어요.` : `${added.length}장을 올렸어요.` });
  }
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));
  const imageOk = /^(https?:\/\/|\/api\/product-image\/)/i.test(v.imageUrl);

  // 입력한 이미지 주소가 실제로 열리는지 브라우저에서 확인합니다.
  const [check, setCheck] = useState<{ state: "idle" | "loading" | "ok" | "error"; size?: string }>({ state: "idle" });
  useEffect(() => {
    if (!imageOk) {
      setCheck({ state: "idle" });
      return;
    }
    setCheck({ state: "loading" });
    let cancelled = false;
    const timer = setTimeout(() => {
      const img = new window.Image();
      img.onload = () => !cancelled && setCheck({ state: "ok", size: `${img.naturalWidth}×${img.naturalHeight}` });
      img.onerror = () => !cancelled && setCheck({ state: "error" });
      img.src = v.imageUrl;
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [v.imageUrl, imageOk]);

  // 이미지 파일 올리기: 올리면 이미지 주소 칸이 자동으로 채워집니다.
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadMsg(null);
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) return setUploadMsg({ ok: false, text: "JPG, PNG, WEBP, GIF 파일만 올릴 수 있어요." });
    if (file.size > MAX_ORIGINAL) return setUploadMsg({ ok: false, text: "원본 파일은 20MB 이하여야 해요." });
    setUploading(true);
    try {
      const prepared = await prepare(file);
      if (!prepared) throw new Error("이미지를 줄여도 2MB를 넘어요. 더 작은 이미지를 올려 주세요.");
      const fd = new FormData();
      fd.append("file", prepared, "upload");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.status === 413) throw new Error("이미지가 너무 커요. 더 작은 이미지를 올려 주세요.");
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "업로드에 실패했어요.");
      setV((p) => ({ ...p, imageUrl: data.url as string }));
      setUploadMsg({ ok: true, text: `올렸어요 (${Math.round(prepared.size / 1024)}KB). 오른쪽 미리보기에서 확인해 주세요.` });
    } catch (err) {
      setUploadMsg({ ok: false, text: err instanceof Error ? err.message : "업로드에 실패했어요." });
    } finally {
      setUploading(false);
    }
  }
  // 이미지 주소를 넣었는데 열리지 않으면 저장하지 못하게 막습니다.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    setFormError(null);
    if (v.imageUrl && !imageOk) return block("이미지는 파일로 올리거나, http:// 또는 https://로 시작하는 주소를 넣어 주세요.");
    if (imageOk && check.state === "loading") return block("이미지를 확인하는 중이에요. 잠시 후 다시 눌러 주세요.");
    if (imageOk && check.state === "error") return block("이미지를 불러올 수 없어요. 주소를 고치거나 비워 주세요.");
    function block(msg: string) {
      e.preventDefault();
      setFormError(msg);
    }
  }
  const colors = COLORS.includes(v.bg) ? COLORS : [v.bg, ...COLORS];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 48, marginTop: 24, alignItems: "flex-start" }}>
      <form action={action} onSubmit={onSubmit} style={{ flex: "1 1 340px", maxWidth: 480 }}>
        {product && <input type="hidden" name="id" value={product.id} />}
        <input type="hidden" name="category" value="women" />
        <fieldset style={{ ...label, marginTop: 0, border: 0, padding: 0 }}>
          <legend style={{ padding: 0 }}>카테고리 (기본은 WOMEN이고, 아래 버튼으로 BEST·NEW에도 표시할 수 있어요)</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            <span style={{ ...chipStyle(true), cursor: "default" }}>WOMEN (기본)</span>
            <label style={chipStyle(flags.inBest)}><input type="checkbox" name="inBest" checked={flags.inBest} onChange={toggle("inBest")} style={hiddenInput} />{flags.inBest ? "✓ " : "+ "}BEST에도 표시</label>
            <label style={chipStyle(flags.inNew)}><input type="checkbox" name="inNew" checked={flags.inNew} onChange={toggle("inNew")} style={hiddenInput} />{flags.inNew ? "✓ " : "+ "}NEW에도 표시</label>
          </div>
        </fieldset>
        <fieldset style={{ ...label, border: 0, padding: 0 }}>
          <legend style={{ padding: 0 }}>WOMEN 하위 분류 (카테고리 화면의 분류 버튼에 쓰여요)</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {["", ...SUB_CATEGORIES].map((s) => (
              <label key={s || "none"} style={chipStyle(v.subCategory === s)}>
                <input type="radio" name="subCategory" value={s} checked={v.subCategory === s} onChange={set("subCategory")} style={hiddenInput} />
                {s || "선택 안 함"}
              </label>
            ))}
          </div>
        </fieldset>
        <label style={label}>상품 이름
          <input name="name" value={v.name} onChange={set("name")} required style={{ ...input, marginTop: 6 }} />
        </label>
        <label style={label}>정가 (원, 숫자만)
          <input name="price" type="number" min={0} value={v.price} onChange={set("price")} required style={{ ...input, marginTop: 6 }} />
        </label>
        <label style={label}>할인율 (선택, 1~99 사이 숫자 — 입력하면 정가에서 자동으로 깎여요)
          <input name="sale" type="number" min={1} max={99} value={v.sale} onChange={set("sale")} placeholder="예: 7" style={{ ...input, marginTop: 6 }} />
          {v.sale && v.price && <span style={{ display: "block", marginTop: 6, color: "#c0392b" }}>할인가 {won(unitPrice({ price: Number(v.price) || 0, sale: `${v.sale}%` }))} (정가 {won(Number(v.price) || 0)})</span>}
        </label>
        <label style={label}>순서 (선택{product ? "" : ", 비우면 맨 뒤"})
          <input name="position" type="number" value={v.position} onChange={set("position")} style={{ ...input, marginTop: 6 }} />
        </label>
        <fieldset style={{ ...label, border: 0, padding: 0, marginBottom: 0 }}>
          <legend style={{ padding: 0 }}>배경색 (이미지가 없을 때 보여요)</legend>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {colors.map((c) => (
              <label key={c} style={{ cursor: "pointer" }}>
                <input type="radio" name="bg" value={c} checked={v.bg === c} onChange={set("bg")} style={{ position: "absolute", opacity: 0 }} />
                <span aria-label={c} style={{ display: "block", width: 32, height: 32, background: c, border: v.bg === c ? "2px solid #111" : "1px solid #ccc" }} />
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset style={{ ...label, border: 0, padding: 0, marginBottom: 0 }}>
          <legend style={{ padding: 0 }}>사이즈별 재고 (비우면 재고를 관리하지 않고 무제한, 0이면 품절)</legend>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {(["S", "M", "L"] as const).map((s) => {
              const k = `stock${s}` as "stockS" | "stockM" | "stockL";
              return (
                <label key={s} style={{ flex: 1, fontSize: 12 }}>{s}
                  <input name={k} type="number" min={0} value={v[k]} onChange={set(k)} placeholder="무제한" style={{ ...input, marginTop: 4 }} />
                </label>
              );
            })}
          </div>
        </fieldset>
        <fieldset style={{ ...label, border: 0, padding: 0 }}>
          <legend style={{ padding: 0 }}>품절</legend>
          <label style={{ ...chipStyle(flags.soldOut), marginTop: 8 }}>
            <input type="checkbox" name="soldOut" checked={flags.soldOut} onChange={toggle("soldOut")} style={hiddenInput} />
            {flags.soldOut ? "✓ 품절 처리됨" : "품절 처리하기"}
          </label>
          <span style={{ display: "block", marginTop: 6 }}>켜면 재고 숫자와 상관없이 SOLD OUT으로 표시되고, 담기·구매할 수 없어요.</span>
        </fieldset>
        <label style={label}>이미지 파일 올리기 (선택, JPG·PNG·WEBP·GIF · 큰 이미지는 자동으로 줄여서 저장해요)
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFile} disabled={uploading} style={{ display: "block", marginTop: 6, fontSize: 13 }} />
        </label>
        {uploading && <div style={{ marginTop: 8, fontSize: 13, color: "#767676" }}>올리는 중...</div>}
        {uploadMsg && <div style={{ marginTop: 8, fontSize: 13, color: uploadMsg.ok ? "#2d6a2d" : "#c0392b" }} role={uploadMsg.ok ? "status" : "alert"}>{uploadMsg.text}</div>}
        <label style={label}>이미지 주소 (파일을 올리면 자동으로 채워져요. 다른 사이트 주소를 직접 넣어도 돼요)
          <input name="imageUrl" value={v.imageUrl} onChange={set("imageUrl")} placeholder="https://..." style={{ ...input, marginTop: 6 }} />
        </label>
        <fieldset style={{ ...label, border: 0, padding: 0 }}>
          <legend style={{ padding: 0 }}>추가 이미지 (선택, 최대 {MAX_EXTRA}장 — 상품 상세에서 대표 이미지 아래 작은 사진으로 보여요)</legend>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={onExtraFiles} disabled={extraBusy || extra.length >= MAX_EXTRA} style={{ display: "block", marginTop: 8, fontSize: 13 }} />
          {extraBusy && <div style={{ marginTop: 6 }}>올리는 중...</div>}
          {extraMsg && <div role={extraMsg.ok ? "status" : "alert"} style={{ marginTop: 6, color: extraMsg.ok ? "#2d6a2d" : "#c0392b" }}>{extraMsg.text}</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            {extra.map((url, i) => (
              <div key={url} style={{ width: 84 }}>
                <input type="hidden" name="extraImages" value={url} />
                <div style={{ aspectRatio: "1", background: "#eee", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`추가 이미지 ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                  <button type="button" onClick={() => moveExtra(i, -1)} disabled={i === 0} aria-label="앞으로 옮기기" style={smallBtn}>←</button>
                  <button type="button" onClick={() => moveExtra(i, 1)} disabled={i === extra.length - 1} aria-label="뒤로 옮기기" style={smallBtn}>→</button>
                  <button type="button" onClick={() => setExtra((cur) => cur.filter((_, n) => n !== i))} aria-label="삭제" style={{ ...smallBtn, color: "#c0392b" }}>×</button>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset style={{ ...label, border: 0, padding: 0 }}>
          <legend style={{ padding: 0 }}>색상 옵션 (선택, 최대 {MAX_COLORS}개 — 고객이 상품 상세에서 색상을 골라요. 재고는 사이즈별로만 관리돼요)</legend>
          {colorRows.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
              {c.name.trim() && <input type="hidden" name="colors" value={`${c.name.trim()}|${c.hex}`} />}
              <input type="color" value={c.hex} aria-label="색상 고르기" onChange={(e) => setColorRows((rows) => rows.map((r, n) => (n === i ? { ...r, hex: e.target.value } : r)))} style={{ width: 40, height: 40, padding: 0, border: "1px solid #ccc", background: "#fff", flex: "none" }} />
              <input type="text" value={c.name} maxLength={20} placeholder="색상 이름 (예: 블랙)" aria-label="색상 이름" onChange={(e) => setColorRows((rows) => rows.map((r, n) => (n === i ? { ...r, name: e.target.value } : r)))} style={{ ...input, flex: 1, width: "auto" }} />
              <button type="button" onClick={() => setColorRows((rows) => rows.filter((_, n) => n !== i))} aria-label="색상 삭제" style={{ ...smallBtn, flex: "none", padding: "10px 12px", color: "#c0392b" }}>삭제</button>
            </div>
          ))}
          <button type="button" onClick={() => setColorRows((rows) => [...rows, { name: "", hex: "#111111" }])} disabled={colorRows.length >= MAX_COLORS} style={{ ...smallBtn, flex: "none", marginTop: 10, padding: "10px 16px" }}>+ 색상 추가</button>
        </fieldset>
        <label style={label}>상품 설명 (선택, 상품 상세 페이지에 보여요)
          <textarea name="description" value={v.description} onChange={set("description")} rows={6} maxLength={2000} style={{ ...input, marginTop: 6, resize: "vertical" }} />
        </label>
        {(formError || state?.error) && <div style={notice(false)} role="alert">{formError ?? state?.error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button type="submit" disabled={pending} style={btnDark}>{pending ? "..." : product ? "SAVE" : "ADD PRODUCT"}</button>
          {product && <Link href="/admin/products" style={{ ...btnDark, background: "#fff", color: "#111", border: "1px solid #111" }}>CANCEL</Link>}
        </div>
      </form>

      <div style={{ width: 240, flex: "none" }}>
        <div style={{ fontSize: 12, color: "#767676", marginBottom: 12 }}>미리보기</div>
        <div style={{ pointerEvents: "none" }}>
          <ProductCard name={v.name || "상품 이름"} {...priceView(Number(v.price) || 0, v.sale ? `${v.sale}%` : null)} bg={v.bg} sale={v.sale ? `${v.sale}%` : undefined} soldOut={flags.soldOut} imageUrl={imageOk && check.state === "ok" ? v.imageUrl : undefined} />
        </div>
        <div style={{ marginTop: 12, fontSize: 12, lineHeight: 1.6, color: check.state === "ok" ? "#2d6a2d" : check.state === "error" ? "#c0392b" : "#767676" }} role="status">
          {v.imageUrl && !imageOk && "이미지 주소는 http:// 또는 https://로 시작해야 해요."}
          {imageOk && check.state === "loading" && "이미지를 확인하는 중..."}
          {imageOk && check.state === "ok" && `✓ 이미지를 불러올 수 있어요 (${check.size}).`}
          {imageOk && check.state === "error" && "✕ 이미지를 불러올 수 없어요. 주소가 이미지 파일을 가리키는지, 다른 사이트가 막고 있지는 않은지 확인해 주세요."}
          {!v.imageUrl && "이미지가 없으면 배경색만 보여요."}
        </div>
      </div>
    </div>
  );
}
