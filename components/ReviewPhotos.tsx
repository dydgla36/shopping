import { thumb } from "@/lib/imageUrl";

// 후기 사진 (누르면 큰 사진이 새 창으로 열립니다)
export default function ReviewPhotos({ photos, size = 88 }: { photos: string[]; size?: number }) {
  if (photos.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
      {photos.map((url) => (
        <a key={url} href={url} target="_blank" rel="noopener noreferrer" aria-label="후기 사진 크게 보기">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(url, 240)} alt="후기 사진" loading="lazy" style={{ width: size, height: size, objectFit: "cover", display: "block", background: "#eee" }} />
        </a>
      ))}
    </div>
  );
}
