from fastapi import APIRouter, status
from service.llm.llm_service import call_llm_with_retry
from service.prompts.win_prediction_prompt import (
    WIN_PREDICTION_SYSTEM_PROMPT,
    build_llm_user_prompt,
)

# ... 기존 라우터 코드 ...

# LLM 호출 및 실패 시 콜백 동작 예시
llm_result = call_llm_with_retry(
    client=openai_client,
    system_prompt=WIN_PREDICTION_SYSTEM_PROMPT,
    user_prompt=user_prompt,
    matchup_data=matchup_payload,
    max_retries=3,
)