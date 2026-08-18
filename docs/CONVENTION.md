# 위닝픽(WinningPick) 팀 컨벤션

## 1. 기술 스택 및 모노레포 구조

- **Frontend**: React + Vite + TypeScript
- **Backend**: Spring Boot + Java
- **AI**: Python FastAPI
- **Repository**: Monorepo (단일 저장소)

폴더 구조는 [../README.md](../README.md) 참고.

## 2. Git 브랜치 전략 및 네이밍 컨벤션

- **`main`**: 최종 배포용 안정 버전. 직접 push 절대 금지, PR을 통해서만 병합
- **`develop`**: 개발 통합 브랜치. 모든 팀원은 기능 개발 완료 후 이 브랜치로 PR 생성
- **`feature/[도메인명]-[세부기능]`**: 개별 기능 개발용 브랜치 (`develop`에서 분기)

도메인별 풀스택(백엔드+프론트) 오너십이라 브랜치명에 영역(be/fe/ai) 구분을 넣지 않는다.

| 도메인명 | 세부기능 | 최종 브랜치명 | 설명 |
|---|---|---|---|
| member | login | `feature/member-login` | 회원 로그인 기능 개발 |
| community | post-write | `feature/community-post-write` | 게시글 작성 기능 개발 |
| win-prediction | model | `feature/win-prediction-model` | AI 승률 예측 모델 개발 |

## 3. 커밋 메시지 컨벤션 (Conventional Commits)

`{type}: {summary}` 형식.

| 타입 | 의미 | 예시 |
|---|---|---|
| `feat` | 새로운 기능 추가 | `feat: 회원 로그인 API 구현` |
| `fix` | 버그 수정 | `fix: 이메일 검증 정규식 예외 버그 수정` |
| `docs` | 문서 수정 | `docs: API 명세서 Swagger 어노테이션 추가` |
| `style` | 코드 스타일 수정 (기능 변화 없음) | `style: Prettier 코드 포맷 정렬 적용` |
| `refactor` | 리팩토링 (기능 변화 없음) | `refactor: 회원 서비스 계층 비즈니스 로직 분리` |
| `test` | 테스트 코드 추가/수정 | `test: 회원 로그인 단위 테스트 작성` |
| `chore` | 빌드/기타 설정 | `chore: build.gradle 의존성 추가` |

## 4. API 요청/응답 표준화 규칙

성공 응답 (HTTP 200 OK):

```json
{
  "success": true,
  "message": "요청이 성공했습니다.",
  "data": {
    "userId": 1,
    "email": "user@example.com"
  }
}
```

실패 응답 (HTTP 4xx / 5xx):

```json
{
  "success": false,
  "status": 400,
  "message": "비밀번호가 일치하지 않습니다.",
  "data": null
}
```

입력값 검증 실패 (HTTP 400 Bad Request) — `@Valid` 검증 실패 시 필드별 에러 사유를 `data`에 Map 구조로 전달:

```json
{
  "success": false,
  "status": 400,
  "message": "입력값 검증에 실패했습니다.",
  "data": {
    "email": "올바른 이메일 형식이 아닙니다.",
    "password": "비밀번호는 8자 이상이어야 합니다."
  }
}
```

프론트엔드 API 호출 원칙 — 모든 API는 공용 Axios 인스턴스를 통해 호출하며, 응답은 항상 `response.data.data`로 꺼내 쓴다:

```tsx
try {
  const response = await apiInstance.post('/api/v1/members/login', requestData);
  if (response.data.success) {
    const { accessToken } = response.data.data;
  }
} catch (error: unknown) {
  // 백엔드 공통 에러 메시지 팝업 출력
}
```

## 5. TypeScript 인터페이스(타입) 정의 규칙

- `frontend/src/types/`에 API 응답 및 컴포넌트 Props 타입을 분리 관리한다.
- 인터페이스/타입명 앞에 `I` prefix(`IUser`)를 사용하지 않는다. (`User`로 명시)

## 6. 코드 네이밍 및 자원 관리 표준

### 6-1. 백엔드(Spring Boot) 클래스 네이밍

| 분류 | 규칙 | 예시 | 비고 |
|---|---|---|---|
| Controller | `~Controller` | `MemberController`, `BoardController` | API 엔드포인트 라우팅 레이어 |
| Service | `~Service` | `MemberService`, `BoardService` | 핵심 비즈니스 로직 레이어 |
| Repository | `~Repository` | `MemberRepository`, `BoardRepository` | DB 데이터 접근 레이어 (JPA) |
| Entity | 단수 명사 (접미사 없음) | `Member`, `Board`, `Payment` | DB 테이블 매핑 객체 (Setter 금지) |
| Exception | `~Exception` | `CustomException`, `BusinessException` | 시스템/비즈니스 예외 객체 |

- 메서드·변수명: 단수 `camelCase` (`findByEmail()`, `Long userId`)
- 상수: `UPPER_SNAKE_CASE` (`MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE`)
- API URL: 소문자 `kebab-case`, 동사 배제, 명사형 복수 (`/api/v1/job-notices`, `/api/v1/user-profiles`)

### 6-2. DTO 파일 분리 규칙

도메인별 Request/Response DTO는 각각 독립된 파일로 분리하고, Java record를 우선 사용한다.

```
dto/
  request/
    RequestLogin.java
  response/
    ResponseLogin.java
```

```java
// dto/request/RequestLogin.java
@Schema(description = "로그인 요청 DTO")
public record RequestLogin(
    @Schema(description = "사용자 이메일", example = "user@example.com")
    @NotBlank(message = "이메일은 필수 입력값입니다.")
    String email,

    @Schema(description = "비밀번호 (8자 이상)", example = "Password123!")
    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    String password
) {}
```

```java
// dto/response/ResponseLogin.java
@Schema(description = "로그인 응답 DTO")
public record ResponseLogin(
    @Schema(description = "JWT Access Token")
    String accessToken,

    @Schema(description = "토큰 만료 시각", example = "2026-07-03T12:00:00Z")
    ZonedDateTime expiresAt
) {}
```

이너클래스로 묶지 않는 이유: 이너클래스는 도메인 DTO 파일이 비대해지고 import 경로(`ResumeDTO.RequestUpload`)가 늘어져 검색성이 떨어진다. 파일 단위 분리 시 클래스명만으로 즉시 탐색 가능하고 Swagger 스키마명도 단순해진다.

## 7. 도메인 상태 관리 (`type/` 패키지)

### 7-1. 백엔드 Enum 명명 및 매핑

- 위치: 도메인 패키지 하위 `type/` (`domain/member/type/RoleType.java`)
- 권한·구분·성격: `~Type` 접미사 (`RoleType`, `LoginType`)
- 진행 상황·단계: `~Status` 접미사 (`OrderStatus`, `PaymentStatus`)
- JPA 매핑 시 반드시 `@Enumerated(EnumType.STRING)` (Ordinal 저장 금지)

```java
public enum RoleType { USER, ADMIN }

public enum OrderStatus { PENDING, COMPLETED, CANCELLED }

@Enumerated(EnumType.STRING)
@Column(nullable = false)
private RoleType role;
```

### 7-2. 프론트엔드 상수 객체 (`as const`)

백엔드 상태값을 화면에서 분기 처리할 때 JSX 내부에 문자열(`"USER"`, `"ADMIN"`)을 직접 박아넣지 않는다.

```ts
// role.ts
export const RoleType = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type RoleType = typeof RoleType[keyof typeof RoleType];
```

## 8. ErrorCode 및 전역 예외 핸들러 (도메인별 분리)

여러 팀원이 동시에 개발할 때 `ErrorCode` 파일 하나를 수정하다 Git 충돌이 나는 것을 막기 위해, 전역 공통 파일과 도메인별 파일을 완전히 분리한다.

- **전역 공통 에러**: `kr.co.winningpick.global.exception.GlobalErrorCode` — 400/404/500 등 전역 기본 에러
- **도메인별 에러**: `kr.co.winningpick.domain.{domain}.exception.{Domain}ErrorCode` (예: `MemberErrorCode`, `BoardErrorCode`) — 도메인 비즈니스 로직에 종속된 에러

```java
@Getter
@RequiredArgsConstructor
public enum MemberErrorCode implements ErrorCodeType {
    USER_NOT_FOUND(HttpStatus.UNAUTHORIZED, "존재하지 않는 이메일입니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다."),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 이메일입니다.");

    private final HttpStatus status;
    private final String message;
}
```

**절대 금지**:
- 기능 하나 만들었다고 자바 예외 파일(`UserNotFoundException.java`)을 새로 생성하는 행위
- 서비스 레이어에서 문자열로 직접 에러를 던지는 행위 (`throw new RuntimeException("회원을 찾을 수 없습니다.")`)

**올바른 예외 호출**:

```java
Member member = memberRepository.findByEmail(email)
    .orElseThrow(() -> new ResourceNotFoundException(MemberErrorCode.USER_NOT_FOUND));

if (!passwordEncoder.matches(rawPassword, member.getPassword())) {
    throw new BadRequestException(MemberErrorCode.INVALID_PASSWORD);
}
```

## 9. 백엔드 컨트롤러 구현 표준

컨트롤러는 HTTP 요청을 받아 서비스 레이어로 전달하고, 공통 응답 포맷(`ApiResponse`)으로 감싸 반환하는 역할만 수행한다. 비즈니스 로직 직접 구현이나 Entity 직접 반환은 금지.

- 클래스 네이밍: `~Controller`
- URL 매핑: 소문자 `kebab-case`, 복수형 명사 (`/api/v1/members`)
- 응답 반환: `ResponseEntity<ApiResponse<T>>`
- 입력값 검증: Request DTO 앞에 `@Valid` 명시

```java
@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController implements MemberControllerDocs {

    private final MemberService memberService;

    @Override
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<ResponseLogin>> login(
            @RequestBody @Valid RequestLogin request
    ) {
        ResponseLogin responseData = memberService.login(request);
        return ResponseEntity.ok(ApiResponse.success("로그인이 완료되었습니다.", responseData));
    }

    @Override
    @GetMapping("/{memberId}")
    public ResponseEntity<ApiResponse<ResponseMember>> getMember(@PathVariable Long memberId) {
        ResponseMember responseData = memberService.getMember(memberId);
        return ResponseEntity.ok(ApiResponse.success("회원 정보 조회가 완료되었습니다.", responseData));
    }
}
```

## 10. 영속성 레이어 및 PostgreSQL / JPA 사용 규칙

### 10-1. Entity 구현 원칙 (불변성 유지)

- `@Setter` 전면 금지. 데이터 변경은 의미 있는 비즈니스 메서드(`updateProfile()`, `changePassword()`)로만 수행
- 기본 생성자는 `@NoArgsConstructor(access = AccessLevel.PROTECTED)`

```java
@Entity
@Table(name = "members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false)
    private String password;

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }
}
```

### 10-2. 연관관계 매핑 원칙

- 단방향 매핑 우선. 양방향은 조회가 빈번하고 객체 탐색이 필수적인 경우에만 신중히 적용
- Fetch 전략은 무조건 `FetchType.LAZY` (EAGER 금지)

### 10-3. Repository 및 조회 규칙

- `~Repository`로 명명하고 `JpaRepository<Entity, ID>` 상속
- 쿼리 메서드 이름이 길어지면 QueryDSL 또는 `@Query` 사용

## 11. Swagger 문서화 규칙

- 개발 서버 접속: `http://localhost:8080/swagger-ui/index.html`
- 기능 개발 완료 후 Swagger UI에서 정상 요청/응답을 최종 검증한 뒤 PR 생성. PR 템플릿에 "Swagger UI 수동 검증" 체크박스를 두고 미검증 시 사유 명시
- `@Tag`, `@Operation` 등 Swagger 어노테이션은 Controller에 직접 작성하지 않고 `docs/` 패키지의 인터페이스로 분리, Controller는 `implements`로 구현

```java
// docs/MemberControllerDocs.java
@Tag(name = "Member API", description = "회원 가입, 로그인 및 회원 정보 관리 API")
public interface MemberControllerDocs {

    @Operation(summary = "회원 로그인", description = "이메일과 비밀번호를 받아 JWT Access Token을 발급합니다.")
    ResponseEntity<ApiResponse<ResponseLogin>> login(RequestLogin request);
}
```

이유: Controller가 Swagger 설명 텍스트로 뒤덮이면 실제 로직 가독성이 떨어진다. 어노테이션과 구현을 분리해 관심사를 나눈다.

## 12. FastAPI 구현 규칙

- 환경 변수 접근은 `core/` 설정 계층을 통해서만 이루어진다.
- API 라우터(`service/api/`)에 복잡한 비즈니스 로직을 직접 작성하지 않는다.
