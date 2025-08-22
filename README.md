# 🎛️ STN STT 관리자 UI (React)

**React + TypeScript + Material-UI 기반 현대적 웹 관리자 대시보드**

STN 고객센터 STT 시스템의 관리자 인터페이스입니다. Whisper STT 처리, ERP 추출, 데이터 관리를 위한 직관적이고 반응형 웹 UI를 제공합니다.

## ✨ 주요 기능

### 🎯 핵심 UI 기능
- 📊 **실시간 대시보드**: 시스템 현황 및 통계 모니터링
- 📂 **STT 처리**: Dual ListBox 기반 직관적 파일 선택 및 일괄 처리
- 📈 **STT 모니터링**: 실시간 Supabase 데이터 기반 상태 모니터링
- 👥 **세션 관리**: 필터링 및 상세 정보 조회
- 🔍 **결과 조회**: ERP 추출 결과 관리 및 등록
- 📁 **파일 관리**: 파일 업로드 및 통계 관리
- 📅 **월별/일별 조회**: 모든 메뉴에서 날짜별 데이터 필터링

### 🛠 기술 스택
- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **상태 관리**: Zustand
- **HTTP Client**: Axios
- **빌드 도구**: Create React App (Webpack)
- **스타일링**: Emotion (CSS-in-JS)

## 🚀 빠른 시작

### 1. 시스템 요구사항
- **Node.js**: 16.0 이상
- **npm**: 8.0 이상 (또는 yarn 1.22 이상)
- **브라우저**: Chrome 90+, Firefox 88+, Safari 14+

### 2. 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

### 3. 환경 설정

React 앱은 API 서버(`http://localhost:8000`)와 통신합니다.
API 서버가 실행 중인지 확인하세요:

```bash
# API 서버 상태 확인
curl http://localhost:8000/health
```

## 📋 메뉴 구성

### 📊 대시보드 (`/dashboard`)
- **실시간 메트릭**: STT 세션, ERP 추출, 등록 현황
- **월별/일별 조회**: 기간별 데이터 분석
- **시스템 상태**: API 서버 연결 및 모델 상태
- **최근 활동**: 처리된 세션 및 추출 결과

### 📂 STT 처리 (`/stt`)
- **월별/일별 조회**: 날짜별 파일 필터링
- **Dual ListBox**: 직관적 파일 선택 인터페이스
- **처리 옵션**: 모델, 언어, 화자분리, ERP추출 설정
- **일괄 처리**: 선택된 파일들의 순차적 STT 처리
- **실시간 진행**: 처리 상황 및 결과 모니터링

### 📈 STT 모니터링 (`/files`) - 구 파일 관리
- **실시간 통계**: Supabase 기반 처리 상태 데이터
- **월별/일별 조회**: 날짜별 상태 모니터링
- **전체 현황**: 파일 수, 성공률, 평균 처리 시간
- **디렉토리별 분석**: 폴더별 상세 통계

### 👥 세션 관리 (`/sessions`)
- **월별/일별 조회**: 날짜별 세션 필터링
- **필터 옵션**: 상태별, 모델별 세션 분류
- **상세 정보**: 세션별 전체 텍스트, 세그먼트, ERP 추출 결과
- **검색 기능**: 파일명 및 내용 기반 검색

### 🔍 결과 조회 (`/results`)
- **날짜별 조회**: 월별/일별 ERP 추출 결과
- **ERP 데이터**: 추출된 항목별 상세 정보
- **등록 관리**: ERP 시스템 연동 테스트 및 상태 관리
- **결과 검토**: 추출 결과 수정 및 승인

### 📁 파일 관리 (`/status`) - 구 파일 상태
- **파일 업로드**: 드래그 앤 드롭 기반 음성 파일 업로드
- **월별/일별 조회**: 날짜별 파일 관리
- **파일 통계**: 전체, 루트, 일자별 파일 수 및 상태
- **지원 형식**: MP3, WAV, M4A, FLAC, AAC, OGG

### ⚙️ 설정 (`/settings`)
- **시스템 설정**: 환경 구성 (개발 예정)
- **사용자 관리**: 권한 및 접근 제어 (개발 예정)

## 🏗 프로젝트 구조

```
stn-admin-react/
├── 📁 public/                 # 정적 파일
│   ├── index.html             # HTML 템플릿
│   ├── favicon.ico            # 파비콘
│   └── manifest.json          # PWA 매니페스트
│
├── 📁 src/                    # 소스 코드
│   ├── 📁 components/         # React 컴포넌트
│   │   ├── dashboard/         # 📊 대시보드 컴포넌트
│   │   │   └── Dashboard.tsx
│   │   ├── stt/               # 📂 STT 처리 컴포넌트
│   │   │   └── STTProcessPage.tsx
│   │   ├── files/             # 📈 STT 모니터링 컴포넌트
│   │   │   └── FileManagementPage.tsx
│   │   ├── sessions/          # 👥 세션 관리 컴포넌트
│   │   │   └── SessionsPage.tsx
│   │   ├── results/           # 🔍 결과 조회 컴포넌트
│   │   │   └── ResultsPage.tsx
│   │   ├── status/            # 📁 파일 관리 컴포넌트
│   │   │   └── FileStatusPage.tsx
│   │   └── layout/            # 공통 레이아웃
│   │       └── MainLayout.tsx
│   │
│   ├── 📁 services/           # API 서비스
│   │   └── api.ts             # FastAPI 백엔드 통신
│   │
│   ├── 📁 store/              # 상태 관리 (Zustand)
│   │   ├── fileStore.ts       # 파일 관련 상태
│   │   ├── sttStore.ts        # STT 처리 상태
│   │   └── systemStore.ts     # 시스템 상태
│   │
│   ├── 📁 types/              # TypeScript 타입 정의
│   │   └── api.ts             # API 인터페이스
│   │
│   ├── App.tsx                # 메인 앱 컴포넌트
│   ├── index.tsx              # React 진입점
│   └── index.css              # 전역 스타일
│
├── package.json               # 의존성 및 스크립트
├── tsconfig.json              # TypeScript 설정
└── README.md                  # 프로젝트 문서
```

## 🔧 주요 컴포넌트

### 🎛️ MainLayout.tsx
- **네비게이션**: 사이드바 기반 메뉴 시스템
- **반응형 디자인**: 모바일/데스크톱 최적화
- **Material-UI AppBar**: 상단 헤더 및 브랜딩

### 📂 STTProcessPage.tsx
- **Dual ListBox**: 파일 선택을 위한 좌우 리스트 인터페이스
- **처리 옵션**: FormControl 기반 설정 UI
- **Progress Tracking**: LinearProgress로 처리 상황 표시
- **Batch Processing**: 선택된 파일들의 순차적 처리

### 📈 FileManagementPage.tsx
- **Real-time Stats**: Supabase 데이터 기반 실시간 통계
- **Card Layout**: Material-UI Card로 정보 구성
- **Date Filtering**: 월별/일별 조회 필터링

### 🔍 ResultsPage.tsx
- **Table View**: TableContainer로 ERP 추출 결과 표시
- **Accordion Details**: 상세 정보 확장/축소
- **Action Buttons**: ERP 등록 및 상태 관리

## 🛠 개발 가이드

### 새 컴포넌트 추가

```typescript
// src/components/example/ExamplePage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const ExamplePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">
        새 페이지
      </Typography>
    </Box>
  );
};

export default ExamplePage;
```

### API 서비스 추가

```typescript
// src/services/api.ts
export const apiService = {
  // 새 API 메서드 추가
  getNewData: async (): Promise<NewDataType> => {
    const response = await axios.get(`${API_BASE_URL}/api/new-endpoint`);
    return response.data;
  },
};
```

### 상태 관리 (Zustand)

```typescript
// src/store/newStore.ts
import { create } from 'zustand';

interface NewStore {
  data: any[];
  loading: boolean;
  setData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useNewStore = create<NewStore>((set) => ({
  data: [],
  loading: false,
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));
```

## 🎨 스타일링 가이드

### Material-UI 테마 사용

```typescript
// 컴포넌트에서 테마 사용
import { useTheme } from '@mui/material/styles';

const theme = useTheme();
const primaryColor = theme.palette.primary.main;
```

### 반응형 디자인

```typescript
// sx prop을 사용한 반응형 스타일
<Box
  sx={{
    display: { xs: 'block', md: 'flex' },
    gap: { xs: 1, md: 2 },
    p: { xs: 2, md: 3 }
  }}
>
```

## 📊 성능 최적화

### 코드 분할
```typescript
// React.lazy를 사용한 컴포넌트 레이지 로딩
const STTProcessPage = React.lazy(() => import('./components/stt/STTProcessPage'));
```

### 메모이제이션
```typescript
// React.memo로 불필요한 리렌더링 방지
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

## 🛠️ 문제 해결

### 자주 발생하는 오류

#### 컴파일 오류
```bash
# TypeScript 타입 오류
Error: Property 'xyz' does not exist on type 'ABC'
해결: types/api.ts에서 인터페이스 정의 확인
```

#### API 연결 오류
```bash
# CORS 오류
Error: Access to fetch at 'http://localhost:8000' blocked by CORS
해결: API 서버의 CORS 설정 확인 (api_server.py)
```

#### 빌드 오류
```bash
# 메모리 부족
Error: JavaScript heap out of memory
해결: NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

## 📈 개발 로드맵

### ✅ 완료된 기능
- [x] 기본 React + TypeScript 구조
- [x] Material-UI 통합
- [x] API 서비스 연동
- [x] 7개 메뉴 구현
- [x] 월별/일별 조회 기능
- [x] Dual ListBox STT 처리
- [x] 실시간 데이터 모니터링

### 🔄 개발 예정
- [ ] PWA (Progressive Web App) 지원
- [ ] 다크 모드 테마
- [ ] 국제화 (i18n) 지원
- [ ] 사용자 권한 관리
- [ ] 모바일 앱 (React Native)
- [ ] 오프라인 모드

## 🔗 관련 링크

- **메인 프로젝트**: [STN_STT_POC](../README.md)
- **API 문서**: http://localhost:8000/docs
- **Material-UI**: https://mui.com/
- **React 공식 문서**: https://reactjs.org/
- **TypeScript 가이드**: https://www.typescriptlang.org/

---

**STN STT 관리자 UI v1.0** - 2025.01.11  
*React + TypeScript + Material-UI 현대적 웹 대시보드*
