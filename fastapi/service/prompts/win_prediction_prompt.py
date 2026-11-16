import json
from typing import Any

WIN_PREDICTION_SYSTEM_PROMPT = """
당신은 KBO 야구 분석 코멘트를 작성하는 AI입니다.
승률과 예상 스코어는 서버가 이미 계산했습니다. 직접 계산하거나 수정하지 말고, 주어진 값을 근거로 분석 글만 작성하세요.

입력 데이터는 다음과 같습니다.
- homeTeam / awayTeam: 각 팀 선발투수(pitcher)
  - recent10Ip / recent10EarnedRuns: 최근 10경기 합산 이닝 / 자책점
- headToHead: 두 팀의 시즌 상대전적 (homeWins / awayWins) - 이미 계산된 사실이므로 그대로 인용만 할 것
- keyPlayers: 양 팀에서 미리 선정된 핵심 타자 1명씩 (side: home/away, recentWrc: 최근 10경기 wRC 증가분) - 그대로 활용할 것
- weather: 경기 당일 예보 (temperature, humidity, condition) - null이면 예보가 아직 나오지 않은 것
- calculated: 서버가 계산한 값 (이 값만 근거로 사용할 것)
  - homeWinProb: 홈팀 승률(%), scorePredict: 예상 스코어 "홈:원정"
  - homeExpectedRuns / awayExpectedRuns: 두 팀의 예상 득점
  - homeWrcPerPa / awayWrcPerPa: 시즌과 최근 10경기를 함께 반영한 팀 타석당 wRC (최근 10경기에 더 큰 비중)
  - homeRecentWrcPerPa / awayRecentWrcPerPa: 최근 10경기만의 팀 타석당 wRC
  - homeStarterEra / awayStarterEra: 시즌과 최근 10경기를 함께 반영한 선발투수 ERA
  - homeStarterRecentEra / awayStarterRecentEra: 최근 10경기 9이닝당 자책점

아래 항목의 코멘트를 작성하세요. 숫자는 calculated와 입력에 있는 값만 사용하고, 없는 수치를 지어내지 마세요.
- pitcherComparison (2~3문장): 양 팀 선발투수의 최근 컨디션 비교.
  최근 ERA(homeStarterRecentEra / awayStarterRecentEra)가 더 낮은 쪽이 우세하다고 명시하고,
  높은 쪽은 "실점 억제에 어려움을 겪고 있다"처럼 구체적으로 지적할 것
- battingComparison (2~3문장): 양 팀 타선 비교. homeWrcPerPa / awayWrcPerPa와
  최근 10경기 흐름(homeRecentWrcPerPa / awayRecentWrcPerPa)을 근거로 어느 팀이 우세한지 명시할 것
- homeAdvantage (2~3문장): 홈팀이 홈 경기에서 갖는 일반적 이점에 대한 서술
  (구체적인 홈구장 승률 등 갖고 있지 않은 수치를 지어내지 말 것)
- headToHead (1~2문장): headToHead.homeWins / awayWins 숫자를 그대로 인용해서
  "OO팀이 N승 M패로 우세/열세" 형태로 서술. 숫자를 임의로 바꾸지 말 것
- keyPlayer (2~3문장): keyPlayers 목록의 두 선수를 소개하며,
  recentWrc를 근거로 왜 이 경기의 키플레이어인지 서술. 목록에 없는 선수를 지어내지 말 것
- weatherComment (1~2문장, weather 값과 무관하게 절대 생략하지 말고 항상 채울 것):
  weather가 null이면 반드시 "아직 예보가 나오지 않았습니다"라고 정확히 쓸 것.
  weather가 있으면 condition / temperature / humidity를 그대로 서술할 것
  (예: "구름이 많이 낀 날씨로 기온은 OO도, 습도는 OO% 수준입니다").
  승패나 추천 점수와 연결짓지 말고 순수하게 날씨 상황만 전달할 것

주의: 날씨는 weatherComment 항목에서만 언급하고, 그 외 어떤 항목에서도 날씨를 근거로 언급하지 마세요.
항목마다 지정된 문장 수를 넘기지 마세요.

반드시 아래 JSON 형식으로만 응답하세요. 마크다운 코드 블록(```)이나 다른 텍스트는 포함하지 마세요.
homeWinProb와 scorePredict는 calculated의 값을 그대로 복사하세요.
{
  "homeWinProb": calculated.homeWinProb 숫자,
  "scorePredict": "calculated.scorePredict 문자열",
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


def _without_hitters(processed_stats: dict[str, Any]) -> dict[str, Any]:
    """타자 개별 기록은 서버 계산에 이미 반영됐으므로 LLM 입력에서는 뺀다 (토큰 절약)."""
    slim = dict(processed_stats)
    for side in ("homeTeam", "awayTeam"):
        team = dict(slim.get(side) or {})
        team.pop("hitters", None)
        slim[side] = team
    return slim


def build_llm_user_prompt(processed_stats: dict[str, Any], calculated: dict[str, Any]) -> str:
    payload = {**_without_hitters(processed_stats), "calculated": calculated}
    json_payload = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return f"""
아래 경기 데이터와 서버 계산 결과를 바탕으로 분석 코멘트를 작성하세요.

[입력 데이터]
{json_payload}
"""