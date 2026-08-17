# 위닝픽 도메인 스펙

도메인별 풀스택(백엔드+프론트) 오너십으로 팀을 나눈다. 담당자는 자기 도메인의 `user-backend`(Spring Boot) / `user-frontend`(React) 양쪽을 모두 작업한다.

## 담당자

| 도메인 | 담당 | GitHub | 적용 모듈 |
|---|---|---|---|
| 1. Auth & Member | 가연 | `@ixxveon` | `user-backend`, `user-frontend` |
| 2. Community | 가연 | `@ixxveon` | `user-backend`, `user-frontend` |
| 3. Calendar & Schedule | 진선우 | `@jinseonwoo` | `user-backend`, `user-frontend`, `batch-server` |
| 4. Dashboard & MyPage | 진선우 | `@jinseonwoo` | `user-backend`, `user-frontend` |
| 5. AI Win Prediction | PiPi._. | `@Seominhyeong` | `ai-fastapi` |

---

## 1. Auth & Member 도메인 (회원 및 인증)

담당: `@ixxveon` · 적용 모듈: `user-backend`, `user-frontend`

### 1.1 소셜 로그인 및 토큰 인증 (OAuth2.0 + JWT)

일반 이메일 가입과 카카오·네이버·구글 소셜 로그인을 지원하고, Spring Security + JWT로 인증/인가를 처리한다.

**플로우**
1. 프론트엔드에서 소셜 로그인 버튼 클릭 → 각 소셜 인가 코드로 리다이렉트
2. 백엔드가 인가 코드를 받아 소셜 서버에서 사용자 정보(이메일, 닉네임 등) 획득
3. `Users` 테이블에 해당 사용자가 없으면 자동 회원가입 처리 후 Access Token(단기) + Refresh Token(장기, Redis 저장) 발급
4. 클라이언트는 이후 API 요청 시 `Authorization: Bearer <Access Token>` 헤더 포함

### 1.2 개인화 온보딩 (최애 구단 및 알림 설정)

가입 직후 또는 마이페이지에서 사용자의 야구 성향 데이터를 수집해 개인화 추천 시스템의 기반을 마련한다.

- **`Users` 테이블**: `user_id`, `email`, `nickname`, `favorite_team_id`(KBO 10개 구단 FK), `push_alarm_enabled`(boolean)
- **API**: `PATCH /api/v1/members/profile` — 최애 구단 변경 시 해당 구단의 홈 경기 일정/AI 분석 데이터를 우선 캐싱·노출하도록 데이터 파이프라인에 반영

---

## 2. Community 도메인 (직관러 소통)

담당: `@ixxveon` · 적용 모듈: `user-backend`, `user-frontend`

### 2.1 경기별 프리뷰/리뷰 게시판 (RDBMS)

캘린더의 경기 상세 화면과 연동되어, 특정 경기(GameID) 단위로 유저들이 의견을 나누는 공간.

- `GET /api/v1/community/games/{gameId}/posts` — 특정 경기에 작성된 글 목록 페이징 조회
- `POST /api/v1/community/posts` — 요청 바디: `gameId`, `title`, `content`, `category`(프리뷰/직관인증/기타)
- `game_id`에 인덱스 필수 (경기별 게시글 조회 쿼리 성능 최적화)

### 2.2 실시간 응원 톡 (WebSocket + STOMP)

경기 진행 중 실시간 대화 + AI 예측 승률 데이터가 상단에 연동되는 핵심 소통 기능.

- 소켓 연결: `ws://server-ip/ws-stomp` → `/sub/chat/room/{gameId}` 채널 구독
- 메시지 송수신: 클라이언트가 `/pub/chat/message`로 전송 → 서버가 해당 `gameId` 방 구독자 전원에게 브로드캐스트
- AI 승률 실시간 연동: `ai-fastapi`가 경기 중 승률 변동 감지 → 백엔드로 웹훅/내부 메시지 전달 → 백엔드가 채팅방 구독자에게 승률 바 데이터 실시간 푸시

### 2.3 직관 승요/패요 배지 시스템 (게이미피케이션)

직관 기록 기반 승률 계산 후 자동으로 프로필에 배지를 부여.

- 직관 인증 완료 + 경기 결과(승/무/패) 확정 시 이벤트 리스너가 `User_Stats` 테이블의 승/패 카운트 갱신
- 직관 3연승 → `badge_status = "WINNING_FAIRY"`(승요)
- 직관 3연패 → `badge_status = "LOSING_FAIRY"`(패요), 마이페이지 대시보드에 위로 메시지 + "승률 70% 이상 경기 추천" 컴포넌트 렌더링

---

## 3. Calendar & Schedule 도메인 (야구 일정 및 직관 캘린더)

담당: `@jinseonwoo` · 적용 모듈: `user-backend`, `user-frontend`, `batch-server`

**개요**
- KBO 공식 경기 일정 동기화: 크롤링/오픈 API로 정규리그·포스트시즌 일정(날짜, 시간, 대진 팀, 구장)을 캘린더에 자동 반영
- 직관 픽(Pick) 캘린더 UI: 응원 구단 기준 월간 달력 + 승률 기반 신호등 색상 시각화
  - 🟢 초록(추천): 승리 확률 60% 이상
  - 🟡 노랑(보통): 45~59%
  - 🔴 빨강(주의): 45% 미만
- 날씨 및 구장 정보 연동: 경기 당일 실시간 기상 정보(강수 확률, 미세먼지, 기온) 연동, 우천 취소 확률 50% 이상 시 추천도 대폭 하락 + 사전 안내

### 3.1 KBO 공식 경기 일정 및 AI 승률 데이터 동기화 (Batch & API)

- **`Games` 테이블**: `id`, `match_date`, `match_time`, `home_team_id`, `away_team_id`, `stadium_id`, `status`(예정/진행중/종료), `home_win_prob`(AI 예측 승률, 0~100)
- **Batch Server 로직**: 매일 새벽 Cron으로 KBO API/크롤링을 통해 일정을 `Games`에 Upsert → `ai-fastapi`에 승률 계산 요청 후 `home_win_prob` 업데이트
- **API**: `GET /api/v1/calendar/games?yearMonth=2026-08&teamId=1` — 특정 월 + 응원팀 ID로 해당 월 일정 리스트 반환

### 3.2 직관 픽(Pick) 신호등 캘린더 UI 연동 로직 (프론트엔드 최적화)

프론트엔드 렌더링 부담을 줄이기 위해 백엔드에서 미리 `recommend_status`를 계산해 내려준다.

- `RECOMMENDED`(🟢): `home_win_prob` ≥ 60%
- `NORMAL`(🟡): 45% ≤ `home_win_prob` < 60%
- `CAUTION`(🔴): `home_win_prob` < 45%

응답 예시: `{ "gameId": 123, "date": "2026-08-15", "opponent": "두산", "recommend_status": "RECOMMENDED" }`

### 3.3 실시간 구장 날씨 연동 및 우천 취소(우취) 경고 시스템 (Open API 연동)

- **`Stadiums` 테이블**: `id`, `name`, `latitude`, `longitude` (날씨 API 호출용 좌표)
- **API**: `GET /api/v1/calendar/games/{gameId}/weather`
- 필터링 로직: 강수 확률 50% 이상 또는 미세먼지 '나쁨' 이상 → `is_weather_warning = true` 반환. 프론트는 추천 경기(초록)라도 우산 아이콘/주의 팝업 노출

---

## 4. Dashboard & MyPage 도메인 (마이 직관 기록 및 승요 트래커)

담당: `@jinseonwoo` · 적용 모듈: `user-backend`, `user-frontend`

**개요**
- 직관 승률 계산기: 등록/직관한 경기의 전체 승/무/패 및 '직관 승률(승요 지수)' 자동 계산 후 대시보드 시각화
- 직관 인증 시스템: 경기장 GPS 위치 인증 또는 모바일 티켓 캡처 업로드
- 게이미피케이션(칭호) — 승리 요정(승요): 직관 승리 70% 달성 시 부여 / 패배 요정(패요): 직관 패배 70% 달성 시 위로 코멘트 + 다음 경기 고승률 픽 추천 연계

### 4.1 직관 기록 등록 및 승요 지수(승률) 대시보드 (RDBMS + 시각화 데이터)

- **`User_Attendances`(직관 기록) 테이블**: `id`, `user_id`, `game_id`, `verify_status`(미인증/인증완료), `result`(승/무/패/우취 — 경기 종료 후 배치로 업데이트)
- **API**: `GET /api/v1/mypage/dashboard`
- 응답: 총 직관 횟수, 승/무/패 카운트, 승률(%), 최근 5경기 결과 배열(예: `["승", "패", "승", "승", "무"]`). 프론트는 파이 차트 + 잔디 심기(GitHub Contributions 형태) UI로 구현

### 4.2 이중 직관 인증 시스템 (GPS & OCR)

허위 기록 방지를 위해 GPS 위치 인증 또는 티켓 캡처 OCR 인증 지원.

> **검토 필요**: OCR 인증 기술적 실현 가능성 확인 필요 (AWS Textract vs NCP Clova OCR 등 벤더 선정 포함)

- **GPS 인증** `POST /api/v1/mypage/verify/gps`
  - 요청: `gameId`, `latitude`, `longitude`
  - 로직: 하버사인(Haversine) 공식으로 사용자 현재 위치와 구장 좌표 거리 계산. 반경 1km 이내 + 경기 시작 전후 2시간 이내면 자동 인증(`verify_status = VERIFIED`)
- **티켓 인증** `POST /api/v1/mypage/verify/ticket`
  - 요청: `multipart/form-data` (이미지 파일)
  - 로직: 서버가 AWS Textract 또는 NCP Clova OCR로 이미지 전송 → 반환 텍스트에서 '날짜', '구장명', '팀명'을 정규식 파싱 후 DB 경기 정보와 일치 검증

### 4.3 게이미피케이션: 칭호(배지) 획득 및 힐링 추천 로직 (Event-Driven)

- 매일 자정, 종료된 경기 결과로 `User_Attendances.result`가 일괄 업데이트될 때 Event Publisher 동작
- 승요/패요 판별(최소 직관 5회 이상 조건):
  - 누적 직관 승률 70% 이상 → `User_Stats.title_badge = WINNING_FAIRY`
  - 누적 직관 승률 30% 이하 → `title_badge = LOSING_FAIRY`

---

## 5. AI Win Prediction 도메인 (AI 야구 승리 및 직관 추천 분석)

담당: `@Seominhyeong` (PiPi._.) · 적용 모듈: `ai-fastapi`

> 상세 스펙 추후 작성 (모델 입력 피처, 승률 계산 로직, 배치 서버/백엔드와의 연동 인터페이스 등)
