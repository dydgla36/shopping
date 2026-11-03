// 브라우저에서 이미지를 줄여 올리는 도구 (상품 이미지, 후기 사진이 같이 씁니다)
export const MAX_ORIGINAL = 20 * 1024 * 1024; // 고를 수 있는 원본 파일 크기
export const MAX_UPLOAD = 2 * 1024 * 1024; // 서버로 보내는 파일 크기 (줄인 뒤)


// 올리기 전에 이미지를 줄입니다. (가로 1200px 이하, JPEG) 움직이는 GIF와 이미 작은 파일은 그대로 올립니다.
export async function prepare(file: File): Promise<Blob | null> {
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

// 이미지 파일 한 장을 줄여서 올리고, 저장된 이미지 주소를 돌려줍니다. 실패하면 사람이 읽을 수 있는 메시지로 오류를 던집니다.
export async function uploadImage(file: File, endpoint = "/api/admin/upload"): Promise<string> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new Error("JPG, PNG, WEBP, GIF 파일만 올릴 수 있어요.");
  if (file.size > MAX_ORIGINAL) throw new Error("원본 파일은 20MB 이하여야 해요.");
  const prepared = await prepare(file).catch(() => null);
  if (!prepared) throw new Error("이미지를 읽을 수 없거나, 줄여도 2MB를 넘어요.");
  const fd = new FormData();
  fd.append("file", prepared, "upload");
  const res = await fetch(endpoint, { method: "POST", body: fd });
  if (res.status === 413) throw new Error("이미지가 너무 커요. 더 작은 이미지를 올려 주세요.");
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "업로드에 실패했어요.");
  return data.url;
}
