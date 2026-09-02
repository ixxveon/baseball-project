import json
from typing import Any

WIN_PREDICTION_SYSTEM_PROMPT = """
당신은 KBO 야구 데이터 분석 전문 AI입니다.
전처리된 타자(최근 10경기 wRC) 및 투수(최근 10경기 ERA) 스탯을 바탕으로 승리 확률 분석 코멘트를 작성하는 역할을 수행합니다.

[중요 출력 지침]
1. 반드시 마크다운(```json ... ```)을 포함하여 유효한 JSON 형식으로만 응답해야 합니다.
2. JSON 외에 인사말, 설명 등 어떠한 추가 문자열도 포함하지 마십시오.
"""


def build_llm_user_prompt(matchup_data: dict[str, Any]) -> str:
    json_payload = json.dumps(matchup_data, ensure_ascii=False, indent=2)
    return f"""
아래 전처리된 경기의 핵심 스탯 데이터를 기반으로 분석을 수행하고, 반드시 지정된 JSON 구조로 응답하세요.

[정제된 경기 데이터]
{json_payload}

[응답 JSON 스키마 구조]
{{
  "homeTeamWinRate": float (홈팀 예상 승률, 0.0 ~ 1.0 사이 값),
  "awayTeamWinRate": float (원정팀 예상 승률, 0.0 ~ 1.0 사이 값),
  "analysisComments": [
    "1줄 요약: 타선 wRC 비교 및 분석",
    "2줄 요약: 선발투수 ERA 및 이닝 비교",
    "3줄 요약: 최종 승부처 종합 예측"
  ]
}}
"""