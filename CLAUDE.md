# WinningPick(위닝픽) — Claude Code Instructions

> Claude Code가 이 프로젝트에서 코드를 작성하고 리뷰할 때 반드시 따라야 하는 규칙 문서다.
> 팀 컨벤션 상세는 `docs/CONVENTION.md`를 최우선으로 따른다.

---

## 0. 작업 시작 전 필수 확인

1. **Convention 확인** — `docs/CONVENTION.md` 기준으로 기존 패턴 파악
2. **기존 코드 패턴 확인** — 유사 도메인 코드를 먼저 읽고, 그 패턴을 우선 재사용
3. 별도 스펙 없이 임의로 기능을 추가하지 않는다.

---

## 1. 팀 컨벤션 준수 체크리스트

### 브랜치 & 커밋

- [ ] 브랜치명이 `feature/[area]-[도메인명]-[세부기능]` 형식인가? (`area`: `be`/`fe`/`ai`)
- [ ] 커밋 메시지가 `{type}: {summary}` 형식(Conventional Commits)인가?
- [ ] `main`에 직접 push하지 않았는가? (PR 필수)
- [ ] 자동 생성 파일, 빌드 산출물이 커밋에 포함되지 않았는가?
- [ ] 보안 정보(토큰, 비밀번호, 개인키)가 커밋에 포함되지 않았는가?

### 아키텍처 & 패키지 구조

- [ ] Backend 코드가 `backend/src/main/java/kr/co/winningpick/{global|domain}/...` 하위에 있는가?
- [ ] `global` 패키지가 특정 도메인 코드를 참조하지 않는가?
- [ ] Frontend 코드가 `frontend/src/` 구조(`api/`, `components/`, `pages/` 등)를 따르는가?
- [ ] FastAPI 코드가 `fastapi/core/`, `fastapi/service/` 구조를 따르는가?

### 네이밍

- [ ] Controller: `{Domain}Controller`, Service: `{Domain}Service`, Repository: `{Domain}Repository`
- [ ] DTO: `Request{Domain}` / `Response{Domain}` — 이너클래스 금지, `dto/request/`·`dto/response/`에 독립 파일로 분리, Java record 우선
- [ ] Enum은 `type/` 패키지에 위치, 권한·구분은 `~Type`, 상태·단계는 `~Status`, `@Enumerated(EnumType.STRING)` 필수
- [ ] TypeScript interface는 PascalCase, `I` prefix 사용 금지

### Backend 구현 규칙

- [ ] Entity를 API 응답으로 직접 반환하지 않았는가?
- [ ] 모든 API 응답이 `ApiResponse<T>` (`success`/`message`/`data` 포맷)를 사용하는가?
- [ ] Controller에서 `Map`을 직접 반환하지 않는가?
- [ ] `RuntimeException`을 직접 생성하지 않고 도메인별 `~ErrorCode`를 사용하는가?
- [ ] Controller 내부에 반복적인 `try-catch`가 없는가? (예외 처리는 경계에서만)
- [ ] Entity에 `@NoArgsConstructor(access = AccessLevel.PROTECTED)`가 있는가?
- [ ] Entity에 `@Setter`를 열지 않고 의미 있는 메서드로 상태를 변경하는가?
- [ ] PK 전략은 `GenerationType.IDENTITY` + `Long` 타입인가?
- [ ] 연관관계 Fetch 전략이 `FetchType.LAZY`인가? (EAGER 금지)
- [ ] Swagger Annotation이 `docs/` 패키지의 인터페이스로 분리되어 있는가?
- [ ] ErrorCode가 `GlobalErrorCode`(전역)와 `{Domain}ErrorCode`(도메인별)로 분리되어 있는가?

### Frontend 구현 규칙

- [ ] 페이지·컴포넌트에서 `axios`를 직접 호출하지 않고 공용 Axios 인스턴스를 사용하는가?
- [ ] 응답 데이터를 `response.data.data`로 안전하게 꺼내 쓰는가?
- [ ] 컴포넌트가 300줄을 넘으면 분리를 검토했는가?
- [ ] 모든 프론트엔드 파일이 TypeScript(`.ts`/`.tsx`)로 작성되었는가?
- [ ] `any` 타입을 사용하지 않았는가? (필요한 경우 `unknown` 사용)
- [ ] `!`(non-null assertion) 대신 옵셔널 체이닝(`?.`) 또는 타입 가드를 사용하는가?
- [ ] `as` 타입 단언이 런타임 안전성이 보장되는 최소한의 경우에만 사용되었는가?
- [ ] 함수의 반환 타입이 명시적으로 작성되었는가?
- [ ] 백엔드 상태값을 JSX에 문자열로 직접 박아넣지 않고 `as const` 상수 객체를 사용하는가?

### FastAPI 구현 규칙

- [ ] 환경 변수 접근이 `core/` 설정 계층을 통해 이루어지는가?
- [ ] API 라우터에 복잡한 비즈니스 로직이 직접 작성되지 않았는가?

### 공통 금지 사항

- 존재하지 않는 클래스, 패키지, API를 추측해서 사용·생성하지 않는다.
- 새 라이브러리를 팀 합의 없이 추가하지 않는다. 필요하다고 판단되면 **"팀 합의 필요"** 라고 명시한다.
- 의미 없는 TODO 코드, 사용하지 않는 import, 주석 처리된 코드를 남기지 않는다.
- 기능 하나 추가했다고 별도 Exception 클래스를 새로 만들지 않는다 (도메인별 `~ErrorCode` 재사용).

---

## 2. 코드 품질 기준

상세 규칙(TypeScript 가이드라인, 클린 코드, 성능, N+1 방지 등)은 [docs/CONVENTION.md](docs/CONVENTION.md) 참고.

핵심만 요약:

- 함수는 한 가지 일만 한다. 20줄을 넘기면 분리를 고려한다.
- 변수·메서드명은 의도를 드러낸다. `data`, `result`, `temp` 같은 모호한 이름을 쓰지 않는다.
- N+1 쿼리를 만들지 않는다. `fetch join` 또는 `@EntityGraph`를 사용한다.
- 목록 조회에는 Projection DTO, 페이지네이션 없는 전체 목록 조회 API를 만들지 않는다.
- 트랜잭션 범위를 최소화한다. 외부 I/O(HTTP 호출, 파일 처리)는 트랜잭션 밖으로 뺀다.

---

## 3. 코드 리뷰 기준

### 반드시 지적해야 하는 항목 (Must Fix)

| 카테고리 | 내용 |
|---|---|
| 보안 | 민감 정보 하드코딩, 인증·인가 누락, SQL Injection 위험 |
| 컨벤션 위반 | `docs/CONVENTION.md` 명시 규칙 위반 |
| 버그 | NPE 가능성, 잘못된 상태 전이, 트랜잭션 누락 |
| API 응답 | `ApiResponse<T>` 미사용, Entity 직접 반환 |
| 예외 처리 | `RuntimeException` 직접 생성, 빈 catch 블록 |

### 권고 사항 (Should Fix)

| 카테고리 | 내용 |
|---|---|
| 성능 | N+1 쿼리, 페이지네이션 누락, 불필요한 전체 조회 |
| 가독성 | 함수 과도한 길이, 모호한 네이밍, 중복 로직 |
| 테스트 | 검증 로직 없이 구현만 있는 경우 |
| 문서 | Swagger 설명과 실제 동작 불일치 |

### 리뷰 출력 형식

```
## Must Fix
- [파일경로:라인] 문제 설명 + 수정 방향

## Should Fix
- [파일경로:라인] 문제 설명 + 수정 제안

## Good
- 잘 작성된 부분 간단히 언급 (선택)
```

---

## 4. PR 작성 지원

PR 본문 작성을 도울 때는 `.github/pull_request_template.md`를 기준으로 한다.
관련 이슈, 작업 모듈, 변경 사항, 테스트 및 검증 결과(Swagger UI 수동 검증 포함), 리뷰어 전달 사항이 누락되면 채워달라고 요청한다.

---

## 5. 테스트 & 빌드 확인 명령어

```bash
# Backend
cd backend && ./gradlew test

# Frontend
cd frontend && npm run build

# FastAPI
cd fastapi && python -m pytest
```

명령어가 아직 준비되지 않은 경우, 리뷰 코멘트 또는 PR에 미실행 사유를 남긴다.
