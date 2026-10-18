# GABBY 쇼핑몰 (Next.js)

Next.js App Router + TypeScript로 만든 패션 쇼핑몰 화면 모음입니다.
상품명, 가격, 이미지 등은 자리표시자이고, 로그인·장바구니·결제 같은 동작은 아직 없는 화면 디자인입니다.

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 배포용 빌드
```

## Vercel 배포

저장소를 Import하면 Framework Preset이 `Next.js`로 자동 선택됩니다. 별도 설정은 필요 없습니다.
이전 HTML 파일(`index.html` 등)이 저장소 맨 위에 남아 있다면 삭제해 주세요.

## DB 연결 (Neon, Postgres)

카테고리 목록(`/list/*`)은 DB에서 상품을 읽습니다. DB가 연결되기 전에는 `lib/lists.ts`의 샘플 데이터를 보여줍니다.

1. Vercel 프로젝트의 Storage(또는 Marketplace)에서 **Neon**을 설치하고 이 프로젝트에 연결합니다.
   `DATABASE_URL`, `DATABASE_URL_UNPOOLED`가 환경 변수로 자동 등록됩니다.
2. 내 컴퓨터에서 `.env.example`을 `.env`로 복사하고, Vercel의 Settings → Environment Variables 또는 Neon 콘솔(Connect)에서 값을 복사해 채웁니다.
3. 터미널에서 실행합니다.

```bash
npm install
npm run db:push   # 테이블 생성
npm run db:seed   # 샘플 상품 넣기 (다시 실행하면 상품이 초기화됩니다)
```

4. 로그인용 테이블(`User` 회원, `Session` 로그인 상태)도 같은 `db:push`로 함께 만들어집니다.
5. 회원가입(`/signup`)과 로그인(`/login`)이 동작합니다. 비밀번호는 암호화해서 저장하고, 로그인하면 `Session` 테이블과 쿠키로 로그인 상태를 유지합니다. 로그인하면 헤더에 이름과 LOGOUT이 보입니다.
6. 로그인이 필요한 화면은 아래 "로그인이 필요한 화면" 항목을 참고하세요.
7. GitHub에 올리면 Vercel이 자동 배포합니다. `.env`는 올리지 마세요.

연결한 DB가 배포(운영)에서도 같은 DB라면, 위 명령은 그 DB에 바로 적용됩니다.

## 주문 테이블

구매 내역을 저장하는 `Order`(주문)와 `OrderItem`(주문 상품) 테이블이 `prisma/schema.prisma`에 정의돼 있습니다.
SQL Editor로 테이블을 직접 만들어 쓰는 경우 `prisma/add-orders.sql`을 한 번 실행하세요. (`npm run db:push`를 쓴다면 자동으로 만들어집니다.)
주문/결제 화면의 PAY 버튼을 누르면 이 테이블에 저장되고, 주문 완료·주문 상세·마이페이지(주문 내역)에서 보여줍니다.
실제 결제(PG)는 연결하지 않았고, 장바구니도 아직 DB에 저장되지 않아서 주문/결제 화면에 보이는 상품 2개(`lib/orders.ts`의 `CHECKOUT_ITEMS`)가 주문됩니다. 주문은 '주문 접수' 상태로 저장됩니다.

## 로그인이 필요한 화면

마이페이지, 주문 내역/상세, 관심 상품, 적립금, 쿠폰, 회원 정보 수정, 취소/반품/교환, 주문/결제, 주문 완료, 후기·문의 작성은 로그인한 회원만 볼 수 있습니다.
로그인하지 않고 들어가면 `/login`으로 이동하고, 로그인하면 원래 가려던 화면으로 돌아옵니다. 장바구니는 로그인 없이 볼 수 있습니다.

- 1차 확인(로그인 쿠키가 있는지): `middleware.ts`의 `PROTECTED` 목록
- 2차 확인(DB 세션이 유효한지): 각 보호 화면 맨 위의 `await requireUser("/주소")`
- 화면을 새로 보호하려면 두 곳에 모두 주소를 추가하세요.
- DB가 연결되기 전에는 로그인할 수 없으므로 이 화면들을 볼 수 없습니다.

## 관리자 페이지 (/admin)

관리자 계정으로 로그인하면 `/admin`으로 이동합니다. 헤더에도 `ADMIN` 링크가 생깁니다.

| 화면 | 기능 |
|---|---|
| 대시보드 | 오늘 주문, 배송 처리 대기, 전체 주문, 회원 수, 주문 금액 합계, 최근 주문 |
| 주문 / 배송 관리 | 주문 목록(받는 사람·연락처·배송지), 상태별 필터, 검색, 주문 상세, 주문 상태 변경, 택배사·운송장 입력 |
| 회원 관리 | 회원 목록과 검색 (보기 전용), 회원별 주문 수 |
| 상품 관리 | 상품 추가·수정·삭제 (카테고리 목록 화면에 바로 반영) |
| 관리자 계정 | 비밀번호 변경 |

**설정 순서 (중요)**
1. 새 코드를 올리기 **전에** Neon SQL Editor에서 `prisma/admin-setup.sql`을 한 번 실행하세요. 컬럼 3개를 추가하고 관리자 계정(아이디 `admin`, 비밀번호 `admin`)을 만듭니다.
2. 코드를 GitHub에 올리면 Vercel이 배포합니다.
3. `/login`에서 `admin` / `admin`으로 로그인한 뒤, **바로 관리자 > 관리자 계정에서 비밀번호를 바꾸세요.**

**주의**
- `admin`/`admin`은 누구나 추측할 수 있는 값입니다. 공개된 주소에서는 고객의 이름·연락처·주소가 노출될 수 있으니 반드시 바꾸세요.
- 관리자 여부는 DB의 `User.role`(`ADMIN`)로 판단합니다. 모든 관리자 화면과 관리자 동작은 서버에서 한 번 더 확인합니다.
- 로그인 시도 횟수 제한이 없습니다. 운영 전에는 추가하는 것을 권장합니다.

## 구조

| 경로 | 설명 |
|---|---|
| `app/layout.tsx` | 공통 레이아웃 (프로모션 띠, 헤더, 푸터, 폰트) |
| `app/globals.css` | 공통 스타일 |
| `app/page.tsx` | 메인 `/` |
| `app/list/[slug]/page.tsx` | 카테고리 목록 `/list/best`, `/list/new`, `/list/men`, `/list/women` |
| `app/product`, `cart`, `checkout`, `order-complete`, `order-detail` | 상품 상세, 장바구니, 주문/결제, 주문 완료, 주문 상세 |
| `app/login`, `signup`, `find-id`, `find-pw`, `mypage`, `profile-edit`, `wishlist` | 회원 관련 화면 |
| `app/claims`, `points`, `coupons` | 취소/반품/교환, 적립금, 쿠폰 (마이페이지 메뉴) |
| `app/review`, `review/write`, `qna`, `qna/write`, `notice`, `about`, `search` | 후기, 문의, 공지, 소개, 검색 |
| `components/` | `Header`, `Footer`, `ProductCard` |
| `lib/lists.ts` | 카테고리 목록 샘플 데이터 |
| `lib/auth.ts`, `app/actions/auth.ts` | 비밀번호 암호화, 세션, 회원가입·로그인·로그아웃 |
| `middleware.ts` | 로그인 쿠키가 없으면 로그인 화면으로 보냄 (1차 확인) |
| `components/LoginForm.tsx`, `SignupForm.tsx` | 로그인·회원가입 폼 |
| `app/admin/`, `app/actions/admin.ts`, `lib/admin.ts` | 관리자 화면, 관리자 동작, 관리자 확인 |
| `lib/db.ts`, `lib/products.ts` | Prisma 연결, 상품 조회 (DB 실패 시 샘플로 대체) |
| `prisma/schema.prisma`, `prisma/seed.ts` | DB 테이블 정의, 샘플 상품 입력 |
