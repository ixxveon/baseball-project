import json
from typing import Dict, Any

WIN_PREDICTION_SYSTEM_PROMPT = """
당신은 KBO 야구 데이터 분석 전문 AI입니다.
전처리된 타자(최근 10경기 wRC) 및 투수(최근 10경기 ERA) 스탯을 바탕으로 승리 확률 분석 코멘트를 작성하는 역할을 수행합니다.
"""

def build_llm_user_prompt(matchup_data: Dict[str, Any]) -> str:
    json_payload = json.dumps(matchup_data, ensure_ascii=False, indent=2)
    return f"""
아래 전처리된 경기의 핵심 스탯 데이터를 기반으로 분석을 준비하세요.

[정제된 경기 데이터]
{json_payload}

[요청 사항]
1. 타선의 최근 10경기 wRC 및 선발투수의 ERA를 비교 분석
2. AI 승리 확률 분석 코멘트 3줄 요약 작성 준비
"""