# SmartFM - 스마트 빌딩 관리 시스템

**Node.js + Express + React + MariaDB** 기반의 풀스택 빌딩 관리 애플리케이션

## 주요 기능

- 🏢 **건물 관리** - 건물 정보 등록/수정/삭제, 유형별 분류
- 👤 **입주자 관리** - 개인/법인 입주자 정보 관리
- 📄 **계약 관리** - 임대/전세/월세 계약 관리
- 🔧 **유지보수** - 시설 점검 및 수리 요청 관리
- 💰 **비용 관리** - 건물 운영 비용 추적 및 월별 요약
- 📢 **공지사항** - 건물별/전체 공지사항 관리
- 📊 **대시보드** - 실시간 통계 및 현황 시각화

## 기술 스택

| 구분 | 기술 |
|------|------|
| Backend | Node.js, Express, Sequelize ORM |
| Frontend | React 18, Material-UI, React Query |
| Database | MariaDB |
| 인증 | JWT (JSON Web Token), bcrypt |
| 차트 | Recharts |

## 프로젝트 구조

```
smartfm/
├── backend/
│   ├── src/
│   │   ├── controllers/   # API 컨트롤러
│   │   ├── models/        # Sequelize 모델
│   │   ├── migrations/    # DB 마이그레이션
│   │   ├── routes/        # 라우트 정의
│   │   ├── services/      # 비즈니스 로직
│   │   └── utils/         # 유틸리티 (DB, 응답, 인증)
│   ├── tests/
│   └── app.js
├── frontend/
│   └── src/
│       ├── components/    # 재사용 컴포넌트
│       ├── pages/         # 페이지 컴포넌트
│       ├── services/      # API 서비스
│       ├── hooks/         # 커스텀 훅
│       ├── context/       # React Context
│       └── styles/        # 테마 및 스타일
├── docs/
│   └── api.md             # API 문서
└── scripts/
    └── setup-db.js        # DB 초기화 스크립트
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm run install:all
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 열어 DB 연결 정보와 JWT 시크릿을 설정하세요
```

### 3. 데이터베이스 설정

```bash
# DB 생성
node scripts/setup-db.js

# 마이그레이션 실행
cd backend && npx sequelize-cli db:migrate
```

### 4. 개발 서버 실행

```bash
# 루트에서 백엔드 + 프론트엔드 동시 실행
npm run dev
```

또는 개별 실행:
```bash
# 백엔드 (포트 5000)
npm run backend

# 프론트엔드 (포트 3000)
npm run frontend
```

## API 문서

자세한 API 엔드포인트 문서는 [docs/api.md](./docs/api.md)를 참고하세요.

## 테스트

```bash
cd backend && npm test
```

## 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `DB_HOST` | MariaDB 호스트 | `localhost` |
| `DB_PORT` | MariaDB 포트 | `3306` |
| `DB_NAME` | 데이터베이스 명 | `smartfm` |
| `DB_USER` | DB 사용자 | `root` |
| `DB_PASSWORD` | DB 비밀번호 | - |
| `PORT` | 백엔드 서버 포트 | `5000` |
| `JWT_SECRET` | JWT 시크릿 키 | - |
| `JWT_EXPIRES_IN` | JWT 만료 시간 | `24h` |
| `REACT_APP_API_URL` | 프론트엔드 API URL | `http://localhost:5000/api` |
