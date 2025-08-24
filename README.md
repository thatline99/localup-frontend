# 로컬업 프론트엔드

로컬업 : 자영업자를 위한 AI 솔루션 서비스 프론트엔드

## 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- pnpm (패키지 매니저)

### 설치 및 실행

#### 1. pnpm 설치 (아직 설치하지 않은 경우)

```bash
npm install -g pnpm
```

#### 2. 의존성 설치

```bash
pnpm install
```

#### 3. 개발 서버 실행

```bash
pnpm run dev
```

개발 서버가 실행되면 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인할 수 있습니다.

### 기타 명령어

```bash
pnpm run build    # 프로덕션 빌드
pnpm run start    # 프로덕션 서버 실행
pnpm run lint     # 린트 검사
pnpm run format   # 코드 포맷팅
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 랜딩 페이지
│   ├── sign-in/           # 로그인 페이지
│   ├── sign-up/           # 회원가입 페이지
│   └── dashboard/         # 대시보드 관련 페이지
│       ├── page.tsx       # 대시보드 메인
│       ├── ai/            # AI 추천 페이지
│       ├── trends/        # 트렌드 분석 페이지
│       ├── competitors/   # 경쟁사 분석 페이지
│       ├── reports/       # 리포트 페이지
│       ├── profile/       # 프로필 페이지
│       └── settings/      # 설정 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트 (Button, Card, Input 등)
│   ├── landing/          # 랜딩 페이지 컴포넌트
│   ├── dashboard/        # 대시보드 컴포넌트
│   ├── chat/             # 채팅 위젯
│   └── trends/           # 트렌드 분석 컴포넌트
├── config/               # 설정 파일
└── types/                # TypeScript 타입 정의
```

## 주요 페이지

### 공개 페이지

- **랜딩 페이지** (`/`) - 서비스 소개 및 주요 기능 안내
- **로그인** (`/sign-in`) - 사용자 로그인 (카카오 로그인 지원)
- **회원가입** (`/sign-up`) - 신규 사용자 등록

### 대시보드 페이지 (인증 필요)

- **대시보드 메인** (`/dashboard`) - 핵심 지표 및 위젯 요약
- **AI 추천** (`/dashboard/ai`) - AI 기반 비즈니스 인사이트
- **트렌드 분석** (`/dashboard/trends`) - 시장 트렌드 및 예측
- **경쟁사 분석** (`/dashboard/competitors`) - 경쟁사 모니터링
- **리포트** (`/dashboard/reports`) - 상세 분석 리포트
- **프로필** (`/dashboard/profile`) - 사용자 프로필 관리
- **설정** (`/dashboard/settings`) - 서비스 설정

## 기술 스택

### 프레임워크 및 라이브러리

- **Next.js 15.1.8** - React 기반 프레임워크 (App Router 사용)
- **React 19** - UI 라이브러리
- **TypeScript 5** - 타입 안정성을 위한 언어

### 스타일링

- **Tailwind CSS 3.4** - 유틸리티 기반 CSS 프레임워크
- **PostCSS** - CSS 전처리기

### 개발 도구

- **Turbopack** - Next.js의 고속 번들러 (개발 모드)
- **ESLint** - 코드 품질 검사
- **Prettier** - 코드 포맷터 (Tailwind CSS 플러그인 포함)

### 배포

- **Cloudflare Pages** - Edge 배포 지원 (@cloudflare/next-on-pages)

## 주요 기능 : API 서버 개발 중

- AI 기반 비즈니스 인사이트 제공
- 실시간 트렌드 분석 및 예측
- 경쟁사 모니터링
- 날씨 정보 및 이벤트 캘린더
- 고객 리뷰 분석
- 대화형 AI 채팅 지원
- 반응형 디자인 (모바일/데스크톱 지원)
