# API 엔드포인트 문서

Base URL: `http://localhost:5000/api`

## 인증 (Authentication)

| 메서드 | 경로 | 설명 | 인증 필요 |
|--------|------|------|-----------|
| POST | `/auth/register` | 회원가입 | ❌ |
| POST | `/auth/login` | 로그인 (JWT 토큰 반환) | ❌ |
| POST | `/auth/logout` | 로그아웃 | ✅ |
| GET  | `/auth/me` | 현재 사용자 정보 조회 | ✅ |

### 로그인 요청 예시
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 로그인 응답 예시
```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

## 건물 관리 (Buildings)

모든 요청에 `Authorization: Bearer <token>` 헤더 필요

| 메서드 | 경로 | 설명 | 쿼리 파라미터 |
|--------|------|------|---------------|
| GET | `/buildings` | 건물 목록 조회 | `page`, `limit`, `search`, `status`, `buildingType` |
| GET | `/buildings/:id` | 특정 건물 조회 | - |
| POST | `/buildings` | 건물 등록 | - |
| PUT | `/buildings/:id` | 건물 수정 | - |
| DELETE | `/buildings/:id` | 건물 삭제 | - |
| GET | `/buildings/stats` | 건물 통계 조회 | - |

### 건물 등록 요청 바디
```json
{
  "name": "스마트 빌딩 A동",
  "address": "서울시 강남구 테헤란로 123",
  "totalFloors": 15,
  "totalUnits": 60,
  "buildingType": "상업용",
  "constructionYear": 2010,
  "totalArea": 5000.00,
  "description": "강남 중심부 위치 상업용 빌딩",
  "status": "active"
}
```

## 입주자 관리 (Tenants)

| 메서드 | 경로 | 설명 | 쿼리 파라미터 |
|--------|------|------|---------------|
| GET | `/tenants` | 입주자 목록 | `page`, `limit`, `search`, `buildingId`, `status` |
| GET | `/tenants/:id` | 특정 입주자 조회 | - |
| POST | `/tenants` | 입주자 등록 | - |
| PUT | `/tenants/:id` | 입주자 수정 | - |
| DELETE | `/tenants/:id` | 입주자 삭제 | - |

## 계약 관리 (Contracts)

| 메서드 | 경로 | 설명 | 쿼리 파라미터 |
|--------|------|------|---------------|
| GET | `/contracts` | 계약 목록 | `page`, `limit`, `buildingId`, `tenantId`, `status`, `contractType` |
| GET | `/contracts/:id` | 특정 계약 조회 | - |
| POST | `/contracts` | 계약 등록 | - |
| PUT | `/contracts/:id` | 계약 수정 | - |
| DELETE | `/contracts/:id` | 계약 삭제 | - |

## 유지보수 (Maintenance)

| 메서드 | 경로 | 설명 | 쿼리 파라미터 |
|--------|------|------|---------------|
| GET | `/maintenance` | 유지보수 목록 | `page`, `limit`, `buildingId`, `status`, `category`, `priority` |
| GET | `/maintenance/:id` | 특정 항목 조회 | - |
| POST | `/maintenance` | 유지보수 등록 | - |
| PUT | `/maintenance/:id` | 유지보수 수정 | - |
| DELETE | `/maintenance/:id` | 유지보수 삭제 | - |
| GET | `/maintenance/stats` | 카테고리별 통계 | `buildingId` |

## 비용 관리 (Expenses)

| 메서드 | 경로 | 설명 | 쿼리 파라미터 |
|--------|------|------|---------------|
| GET | `/expenses` | 비용 목록 | `page`, `limit`, `buildingId`, `category`, `year`, `month` |
| GET | `/expenses/:id` | 특정 비용 조회 | - |
| POST | `/expenses` | 비용 등록 | - |
| PUT | `/expenses/:id` | 비용 수정 | - |
| DELETE | `/expenses/:id` | 비용 삭제 | - |
| GET | `/expenses/monthly-summary` | 월별 비용 요약 | `buildingId`, `year` |

## 공지사항 (Notices)

| 메서드 | 경로 | 설명 | 쿼리 파라미터 |
|--------|------|------|---------------|
| GET | `/notices` | 공지사항 목록 | `page`, `limit`, `buildingId`, `noticeType`, `isImportant` |
| GET | `/notices/:id` | 특정 공지 조회 | - |
| POST | `/notices` | 공지 등록 | - |
| PUT | `/notices/:id` | 공지 수정 | - |
| DELETE | `/notices/:id` | 공지 삭제 | - |

## 표준 응답 형식

### 성공 응답
```json
{
  "success": true,
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": { ... }
}
```

### 페이지네이션 응답
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "에러 메시지",
  "errors": { ... }
}
```
