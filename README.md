# HAEUN.dev

한국어와 영어를 지원하는 개발자 포트폴리오 플랫폼입니다. Next.js App Router 기반 공개 사이트와 Firebase 인증으로 보호되는 관리자 CMS를 함께 제공합니다.

## 주요 기능

- 터미널 스타일 반응형 포트폴리오와 명령어 인터페이스
- 한국어·영어 페이지 및 언어 설정 기억
- Firestore 프로젝트, 개발 기록, 경험 관리
- Firebase Storage 이미지 라이브러리
- Firebase Authentication 관리자 로그인과 서버 세션 검증
- Zod 입력 검증, 스팸 허니팟, 문의 API 요청 제한
- Markdown 개발 기록, 코드 구문 강조
- 검색·기술·분류별 프로젝트 필터와 블로그 검색
- 동적 sitemap, robots.txt, Open Graph 메타데이터

## 기술 스택

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS 4
- Firebase Authentication, Firestore, Storage, Firebase Admin SDK
- Framer Motion, Lucide React
- Zod, React Hook Form, React Markdown, rehype-highlight
- Vercel 배포 구성

## 시작하기

### 요구 사항

- Node.js 20 이상
- npm
- Firebase 프로젝트 (로그인, Firestore, Storage 사용)

### 설치 및 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 여세요. 루트 주소는 기본 언어인 `/ko`로 이동하며, 언어 선택 후에는 `/` 방문 시 선택한 언어를 사용합니다.

### 확인 명령

```bash
npm run typecheck
npm run build
npm run start
```

`npm run start`는 먼저 `npm run build`를 실행한 뒤 사용합니다.

## 환경 변수

프로젝트 루트의 `.env.example`을 참고해 `.env.local`을 만들고 Firebase 콘솔의 값으로 채우세요. `.env`, `.env.local`은 Git에서 제외됩니다. 서비스 계정 키는 저장소나 메시지에 올리지 마세요.

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인. canonical metadata 및 sitemap 생성에 사용 |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase 브라우저 SDK 설정 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase 브라우저 SDK 설정 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase 브라우저 SDK 설정 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase 브라우저 SDK 설정 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase 브라우저 SDK 설정 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase 브라우저 SDK 설정 |
| `FIREBASE_PROJECT_ID` | 서버 Firebase Admin SDK 프로젝트 ID |
| `FIREBASE_CLIENT_EMAIL` | 서비스 계정 JSON의 `client_email` |
| `FIREBASE_PRIVATE_KEY` | 서비스 계정 JSON의 `private_key`. `.env`에서는 줄바꿈 `\n`을 유지 |
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage 버킷 이름 |
| `ADMIN_EMAILS` | 관리자 Firebase Auth 이메일. 여러 주소는 쉼표로 구분 |

Firebase 클라이언트 값은 Firebase Console → Project settings → General → Your apps에서 확인합니다. 서버 전용 4개 값은 Project settings → Service accounts에서 만든 서비스 계정 키 JSON과 Storage 설정에서 확인하세요. 서비스 계정 JSON 파일 자체는 커밋하지 않습니다.

## Firebase 초기 설정

1. Firebase Authentication에서 Email/Password 로그인 공급자를 켭니다.
2. 관리자 계정을 Authentication에 생성합니다. 해당 주소를 `ADMIN_EMAILS`에 추가합니다.
3. Firestore Database와 Storage 버킷을 생성합니다.
4. `firestore.rules`, `firestore.indexes.json`, `storage.rules`를 검토 후 Firebase CLI로 배포합니다.

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Firestore 규칙은 익명 쓰기를 허용하지 않습니다. 공개 사이트 콘텐츠 쓰기와 Storage 업로드·삭제는 서버에서 관리자 세션을 확인한 API를 통해 처리합니다. Firebase Admin SDK는 서버 환경 변수만 사용합니다.

### 관리자 계정 권한

관리자 로그인은 Firebase Auth ID 토큰을 서버에서 검증하고 `ADMIN_EMAILS` 허용 목록과 비교한 다음 HttpOnly 세션 쿠키를 발급합니다. 모든 `/admin` 화면과 관리자 API는 서버 세션을 다시 검증합니다. 클라이언트에서 전달한 관리자 역할은 신뢰하지 않습니다.

Firestore 브라우저 규칙에서 관리자 읽기 권한이 필요한 경우 `users/{uid}` 문서에 `role: "admin"`을 별도로 설정하세요. 관리자 CMS의 쓰기는 서버 Admin SDK를 통해 수행됩니다.

## 데이터 구조

Firestore 컬렉션:

| 컬렉션 | 설명 |
| --- | --- |
| `users` | 관리자 역할 메타데이터 |
| `profile` | 공개 프로필 데이터 |
| `projects` | 프로젝트 문서, 한국어·영어 설명, 이미지와 링크, 공개 상태 |
| `experiences` | 경력 및 활동 타임라인 |
| `posts` | Markdown 개발 기록, 카테고리, 태그, SEO 필드 |
| `messages` | 비공개 문의와 상태 |
| `siteSettings` | 프로필·사이트·SEO 설정 (`public` 문서) |
| `rateLimits` | 문의 API 요청 제한 카운터 및 만료 시각 |

프로젝트와 게시글의 기본 레코드는 `src/features/projects/seed-projects.ts`에 초안으로 준비되어 있습니다. 관리자 프로젝트 화면의 **IMPORT INITIAL DRAFTS**로 Firestore에 가져올 수 있습니다. 공개하기 전에 설명, 링크, 기간, 역할을 확인하고 `published`를 켜세요. `SignBridge AI`, `CursorBridge`, `E우리`의 미확인 정보는 임의로 채우지 않습니다.

## 페이지 경로

공개 페이지는 `/ko` 또는 `/en` 접두어를 사용합니다.

- `/{locale}`
- `/{locale}/about`
- `/{locale}/projects`, `/{locale}/projects/[slug]`
- `/{locale}/experience`
- `/{locale}/blog`, `/{locale}/blog/[slug]`
- `/{locale}/contact`
- `/admin/login`, `/admin` 및 콘텐츠 관리 경로

## 배포

Vercel 프로젝트에 저장소를 연결하고 필요한 환경 변수를 등록하세요. `NEXT_PUBLIC_SITE_URL`에는 실제 배포 도메인을 설정합니다. Firebase 서비스 계정 개인 키는 Vercel의 서버 환경 변수에만 저장하세요. Preview와 Production 환경의 Firebase 프로젝트를 분리하는 것을 권장합니다.

## 진행 상황

구현 진행 단계와 알려진 제한 사항은 [DEVELOPMENT.md](./DEVELOPMENT.md)에 기록합니다. Firebase 프로젝트 값이 없는 환경에서는 인증, Firestore, Storage 기반 기능을 사용할 수 없습니다.
