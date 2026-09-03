import json
from typing import Any, Dict

WIN_PREDICTION_SYSTEM_PROMPT = """
당신은 KBO 야구 데이터 분석 전문 AI입니다.
전처리된 타자 및 투수 스탯을 바탕으로 승리 확률 분석 코멘트를 작성하는 역할을 수행합니다.
반드시 JSON 객체 형태로 응답해야 합니다.
"""


def build_llm_user_prompt(home_win_rate: float, processed_stats: Dict[str, Any]) -> str:
    json_payload = json.dumps(processed_stats, ensure_ascii=False, indent=2)
    return f"""
아래 정제된 경기 스탯 데이터를 분석할 준비를 하세요.

[산출된 홈팀 승률]
{home_win_rate * 100:.1f}%

[입력 데이터]
{json_payload}

[요청 사항]
1. 타선의 최근 10경기 wRC 및 선발투수의 ERA를 비교 분석
2. AI 승리 확률 분석 코멘트 작성
"""