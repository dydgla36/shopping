import { INTERNAL_IMAGE } from "@/lib/imageRefs";

// 우리가 저장한 이미지는 가로 크기를 정해 가볍게 불러옵니다. (다른 사이트 주소는 그대로)
export const thumb = (url: string | null | undefined, width: 240 | 480 | 800) => (url && INTERNAL_IMAGE.test(url) ? `${url}?w=${width}` : (url ?? undefined));
export const thumbSet = (url: string | null | undefined) => (url && INTERNAL_IMAGE.test(url) ? `${url}?w=480 480w, ${url}?w=800 800w` : undefined);
