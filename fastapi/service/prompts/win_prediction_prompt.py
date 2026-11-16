import json
import re
from typing import Any

# 날씨 조회 결과 상태 (prediction_service의 _fetch_weather가 반환)
WEATHER_STATUS_OK = "ok"                # 정상 조회
WEATHER_STATUS_NOT_READY = "not_ready"  # 조회는 정상이나 해당 경기 시각의 예보가 아직 없음
WEATHER_STATUS_ERROR = "error"          # API 키 누락, 네트워크 오류 등 조회 실패

WIN_PREDICTION_SYSTEM_PROMPT = """
당신은 KBO 야구 분석 코멘트를 작성하는 AI입니다.
승률과 예상 스코어는 서버가 이미 계산했습니다. 직접 계산하거나 수정하지 말고, 주어진 값을 근거로 분석 글만 작성하세요.

입력 데이터는 다음과 같습니다.
- homeTeam / awayTeam: 각 팀 선발투수(pitcher)
  - recent10Ip / recent10EarnedRuns: 최근 10경기 합산 이닝 / 자책점
- headToHead: 두 팀의 시즌 상대전적 (홈팀 승수 homeWins / 원정팀 승수 awayWins) - 이미 계산된 사실이므로 숫자만 그대로 인용할 것
- keyPlayers: 양 팀에서 미리 선정된 핵심 타자 1명씩 (side: home/away, 최근 10경기 wRC 증가분 recentWrc) - 그대로 활용할 것
- 날씨 정보: 경기 당일 예보. '날씨 상태'가 "정상"이면 날씨 / 기온 / 습도가 함께 주어지고,
  "예보없음"이면 아직 예보가 나오지 않은 것, "조회실패"이면 날씨 조회 자체에 실패한 것
- 서버 계산값: 서버가 계산한 값 (이 값만 근거로 사용할 것)
  - 홈팀 승률(%), 예상 스코어(홈:원정)
  - 홈팀 예상 득점, 원정팀 예상 득점
  - 홈팀 / 원정팀 타선 종합 타석당 wRC: 시즌과 최근 10경기를 함께 반영한 값 (최근 10경기에 더 큰 비중)
  - 홈팀 / 원정팀 타선 최근 10경기 타석당 wRC: 최근 10경기만의 값
  - 홈팀 / 원정팀 선발 종합 ERA: 시즌과 최근 10경기를 함께 반영한 값
  - 홈팀 / 원정팀 선발 최근 10경기 ERA: 최근 10경기 9이닝당 자책점

아래 항목의 코멘트를 작성하세요. 숫자는 서버 계산값과 입력에 있는 값만 사용하고, 없는 수치를 지어내지 마세요.
- pitcherComparison (2~3문장): 양 팀 선발투수의 최근 컨디션 비교.
  '선발 최근 10경기 ERA'가 더 낮은 쪽이 우세하다고 명시하고,
  높은 쪽은 "실점 억제에 어려움을 겪고 있다"처럼 구체적으로 지적할 것
- battingComparison (2~3문장): 양 팀 타선 비교. '타선 종합 타석당 wRC'와
  '타선 최근 10경기 타석당 wRC'(최근 10경기 흐름)를 근거로 어느 팀이 우세한지 명시할 것
- homeAdvantage (2~3문장): 홈팀이 홈 경기에서 갖는 일반적 이점에 대한 서술
  (구체적인 홈구장 승률 등 갖고 있지 않은 수치를 지어내지 말 것)
- headToHead (1~2문장): 상대전적의 홈팀 승수 / 원정팀 승수 숫자를 그대로 인용해서
  "OO팀이 N승 M패로 우세/열세" 형태로 서술. 숫자를 임의로 바꾸지 말 것
- keyPlayer (2~3문장): keyPlayers 목록의 두 선수를 소개하며,
  최근 10경기 wRC 증가분을 근거로 왜 이 경기의 키플레이어인지 서술. 목록에 없는 선수를 지어내지 말 것
- weatherComment (1~2문장, 날씨 상태와 무관하게 절대 생략하지 말고 항상 채울 것):
  날씨 상태가 "예보없음"이면 반드시 "아직 예보가 나오지 않았습니다"라고 정확히 쓸 것.
  날씨 상태가 "조회실패"이면 반드시 "현재 날씨 정보를 불러오지 못했습니다"라고 정확히 쓸 것.
  날씨 상태가 "정상"이면 날씨 / 기온 / 습도를 그대로 서술할 것
  (예: "구름이 많이 낀 날씨로 기온은 OO도, 습도는 OO% 수준입니다").
  승패나 추천 점수와 연결짓지 말고 순수하게 날씨 상황만 전달할 것

주의: 날씨는 weatherComment 항목에서만 언급하고, 그 외 어떤 항목에서도 날씨를 근거로 언급하지 마세요.
항목마다 지정된 문장 수를 넘기지 마세요.
작성하는 문장에는 입력 데이터의 필드명이나 영문 식별자(예: homeWins, recentWrc, homeStarterRecentEra)를 절대 그대로 쓰지 말고, 자연스러운 한국어로 풀어서 쓰세요.

반드시 아래 JSON 형식으로만 응답하세요. 마크다운 코드 블록(```)이나 다른 텍스트는 포함하지 마세요.
homeWinProb에는 서버 계산값의 '홈팀 승률(%)' 숫자를, scorePredict에는 '예상 스코어(홈:원정)' 문자열을 그대로 복사하세요.
{
  "homeWinProb": 홈팀 승률 숫자,
  "scorePredict": "예상 스코어 문자열",
  "summary": {
    "pitcherComparison": "...",
    "battingComparison": "...",
    "homeAdvantage": "...",
    "headToHead": "...",
    "keyPlayer": "...",
    "weatherComment": "..."
  }
}
"""

# calculated 키 -> LLM에 넘길 한국어 라벨 (영문 변수명이 문장에 새는 것을 방지)
CALCULATED_LABELS: dict[str, str] = {
    "homeWinProb": "홈팀 승률(%)",
    "scorePredict": "예상 스코어(홈:원정)",
    "homeExpectedRuns": "홈팀 예상 득점",
    "awayExpectedRuns": "원정팀 예상 득점",
    "homeWrcPerPa": "홈팀 타선 종합 타석당 wRC",
    "awayWrcPerPa": "원정팀 타선 종합 타석당 wRC",
    "homeRecentWrcPerPa": "홈팀 타선 최근 10경기 타석당 wRC",
    "awayRecentWrcPerPa": "원정팀 타선 최근 10경기 타석당 wRC",
    "homeStarterEra": "홈팀 선발 종합 ERA",
    "awayStarterEra": "원정팀 선발 종합 ERA",
    "homeStarterRecentEra": "홈팀 선발 최근 10경기 ERA",
    "awayStarterRecentEra": "원정팀 선발 최근 10경기 ERA",
}

# 응답 문장에 영문 필드명이 새어 나왔는지 검사 (wRC, ERA 같은 정상 약어는 걸리지 않음)
# \b는 한글도 단어 문자로 취급해 "homeWrcPerPa가"처럼 조사가 붙으면 못 잡으므로,
# 영문/숫자/밑줄 기준의 lookaround를 쓴다.
_LEAKED_FIELD_PATTERN = re.compile(
    r"(?<![A-Za-z0-9_])(?:"
    r"(?:home|away)[A-Z][A-Za-z0-9]*"
    r"|recent(?:10)?[A-Z][A-Za-z0-9]*"
    r"|scorePredict|keyPlayers?|headToHead|pitcherComparison|battingComparison"
    r")(?![A-Za-z0-9_])"
)


def has_leaked_field_names(summary: dict[str, Any]) -> bool:
    """summary 문장에 영문 필드명이 그대로 노출됐는지 확인한다. True면 재시도/fallback 대상."""
    return any(
        isinstance(text, str) and _LEAKED_FIELD_PATTERN.search(text)
        for text in summary.values()
    )


def _without_hitters(processed_stats: dict[str, Any]) -> dict[str, Any]:
    """타자 개별 기록은 서버 계산에 이미 반영됐으므로 LLM 입력에서는 뺀다 (토큰 절약)."""
    slim = dict(processed_stats)
    for side in ("homeTeam", "awayTeam"):
        team = dict(slim.get(side) or {})
        team.pop("hitters", None)
        slim[side] = team
    return slim


def _relabel_calculated(calculated: dict[str, Any]) -> dict[str, Any]:
    """calculated의 영문 키를 한국어 라벨로 바꾼다. 매핑에 없는 키는 그대로 둔다."""
    return {CALCULATED_LABELS.get(key, key): value for key, value in calculated.items()}


def _weather_payload(weather: dict[str, Any] | None, weather_status: str | None) -> dict[str, Any]:
    """날씨를 '정상 / 예보없음 / 조회실패' 중 하나로 구분해 한국어 키로 넘긴다.
    (isRain 같은 영문 키는 LLM 입력에서 제외)"""
    if weather_status is None:
        weather_status = WEATHER_STATUS_OK if weather else WEATHER_STATUS_NOT_READY

    if weather_status == WEATHER_STATUS_OK and weather:
        return {
            "날씨 상태": "정상",
            "날씨": weather.get("condition"),
            "기온": weather.get("temperature"),
            "습도": weather.get("humidity"),
        }
    if weather_status == WEATHER_STATUS_ERROR:
        return {"날씨 상태": "조회실패"}
    return {"날씨 상태": "예보없음"}


def build_llm_user_prompt(
        processed_stats: dict[str, Any],
        calculated: dict[str, Any],
        weather_status: str | None = None,
) -> str:
    stats = _without_hitters(processed_stats)
    weather = stats.pop("weather", None)
    payload = {
        **stats,
        "날씨 정보": _weather_payload(weather, weather_status),
        "서버 계산값": _relabel_calculated(calculated),
    }
    json_payload = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return f"""
아래 경기 데이터와 서버 계산 결과를 바탕으로 분석 코멘트를 작성하세요.

[입력 데이터]
{json_payload}
"""