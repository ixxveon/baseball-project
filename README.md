# 위닝픽 (WinningPick)

야구 데이터 기반 서비스 플랫폼 — 위닝픽(WinningPick) 모노레포입니다.

## 기술 스택

- **Frontend**: React + Vite + TypeScript
- **Backend**: Spring Boot (Java)
- **AI/Data**: Python FastAPI
- **Repository**: Monorepo

## 폴더 구조

```
winning-pick/
├── .github/                 # GitHub Actions, PR 템플릿
├── docs/                    # 컨벤션 및 스펙 문서
├── frontend/                 # React + Vite + TypeScript
│   ├── public/
│   └── src/
│       ├── api/              # API 호출 함수
│       ├── assets/
│       ├── components/
│       ├── constants/
│       ├── data/              # 목업 시드 데이터
│       ├── hooks/
│       ├── layouts/
│       ├── mocks/             # MSW API 모킹 핸들러
│       ├── pages/
│       ├── routes/
│       ├── styles/
│       ├── types/             # I prefix 금지
│       └── utils/
├── fastapi/                  # Python FastAPI — AI 엔진 및 핵심 모듈
│   ├── core/                  # LLM 인프라 및 공통 설정
│   └── service/
│       ├── api/
│       ├── prompts/
│       └── websocket/
└── backend/                  # Spring Boot API 서버
    └── src/
        ├── main/
        │   ├── java/kr/co/winningpick/
        │   │   ├── global/       # config, exception, response, util
        │   │   └── domain/       # 도메인별 비즈니스 패키지
        │   └── resources/
        └── test/
```

## 브랜치 전략

- `main`: 배포용 안정 버전. 직접 push 금지, PR로만 병합
- `develop`: 개발 통합 브랜치. 모든 기능 브랜치는 여기로 PR
- `feature/[도메인명]-[세부기능]`: 기능 개발 브랜치 (`develop`에서 분기, 도메인별 풀스택 오너십이라 영역 구분 없음)
  - 예: `feature/member-login`, `feature/community-post-write`, `feature/win-prediction-model`

## 커밋 컨벤션

`{type}: {summary}` 형식 (Conventional Commits)

| type | 의미 |
|---|---|
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| docs | 문서 수정 |
| style | 코드 포맷팅 (기능 변화 없음) |
| refactor | 리팩토링 (기능 변화 없음) |
| test | 테스트 코드 |
| chore | 빌드/설정 변경 |

## 상세 컨벤션

전체 컨벤션(네이밍, DTO, API 응답 포맷, ErrorCode 구조, Swagger 등)은 [docs/CONVENTION.md](docs/CONVENTION.md) 참고.

## 도메인 스펙 & 담당

도메인별 기능 명세, DB/API 설계, 담당자는 [docs/DOMAIN_SPEC.md](docs/DOMAIN_SPEC.md) 참고.

## 실행 방법

pull 받은 직후 별도 설정(DB 설치, 환경변수 등) 없이 아래 명령만으로 각 모듈이 바로 뜬다.

### frontend (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

### backend (http://localhost:8080, Swagger: /swagger-ui/index.html)

```bash
cd backend
./gradlew bootRun
```

- 로컬 기본값은 H2 인메모리 DB라 별도 DB 설치 없이 바로 기동된다.
- 실제 PostgreSQL을 붙이고 싶다면 `cp src/main/resources/application-secret.yml.example src/main/resources/application-secret.yml` 후 값 채우면 된다 (이 파일은 git에 올라가지 않음).

### fastapi (http://localhost:8000, docs: /docs)

```bash
cd fastapi
python -m venv .venv
.venv\Scripts\activate   # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## CI

PR을 `main`/`develop`로 올리면 `.github/workflows/ci.yml`이 파일 변경 범위와 무관하게 항상 3개 체크를 전부 돌린다 (하나만 있으면 나머지 체크가 영원히 대기중으로 남아 브랜치 보호 규칙과 충돌하기 때문).

- `Backend Build & Test`: `./gradlew test` + `bootJar`
- `Frontend Typecheck & Build`: `npm run typecheck` + `npm run build` + `npm test`
- `FastAPI Lint & Check`: `ruff check .` + `pytest`

```bash
# 로컬에서 미리 확인
cd frontend && npm run typecheck && npm run build && npm test
cd backend && ./gradlew test bootJar
cd fastapi && ruff check . && pytest tests --tb=short -q
```
