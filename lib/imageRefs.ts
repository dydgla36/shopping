// 우리가 DB에 저장한 이미지 주소("/api/product-image/이미지번호")를 알아보는 도구입니다.
export const INTERNAL_IMAGE = /^\/api\/product-image\/([A-Za-z0-9_-]{10,40})$/;

const internalImageId = (url?: string | null) => (url ? INTERNAL_IMAGE.exec(url)?.[1] : undefined);
export const internalImageIds = (urls: (string | null | undefined)[]) => urls.map(internalImageId).filter((x): x is string => Boolean(x));
