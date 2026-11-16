import json

import anthropic

from core.config import settings
from service.schemas.prediction_schema import (
    WinPredictionResultSchema,
    WinPredictionSummarySchema,
)

FALLBACK_HOME_WIN_PROB = 50.0
FALLBACK_SCORE_PREDICT = "-:-"
FALLBACK_COMMENT = "AI 분석 서비스 연동이 일시적으로 지연되어 상세 분석을 제공할 수 없습니다."
MAX_OUTPUT_TOKENS = 2048


class LLMGenerationError(Exception):
    pass


def _extract_json(text: str) -> str:
    """응답에서 첫 '{'부터 마지막 '}'까지만 잘라낸다 (```json 코드 블록 등 제거)."""
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise LLMGenerationError("LLM 응답에서 JSON을 찾을 수 없습니다.")
    return text[start:end + 1]


class LLMService:
    def __init__(self, model: str = "claude-sonnet-5"):
        self.model = model
        self._client: anthropic.Anthropic | None = None

    @property
    def client(self) -> anthropic.Anthropic:
        if self._client is None:
            self._client = anthropic.Anthropic(api_key=settings.require_anthropic_api_key())
        return self._client

    def generate_win_summary(self, system_prompt: str, user_prompt: str) -> WinPredictionResultSchema:
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=MAX_OUTPUT_TOKENS,
                thinking={"type": "disabled"},
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt},
                ],
            )

            if response.stop_reason == "max_tokens":
                raise LLMGenerationError("LLM 응답이 max_tokens에서 잘렸습니다.")

            content = "".join(
                block.text for block in response.content if getattr(block, "type", None) == "text"
            )
            if not content:
                raise LLMGenerationError("LLM 응답에 텍스트 content가 없습니다.")

            parsed = json.loads(_extract_json(content))
            return WinPredictionResultSchema.model_validate(parsed)

        except (anthropic.AnthropicError, json.JSONDecodeError, TypeError, ValueError) as e:
            raise LLMGenerationError(str(e)) from e

    @staticmethod
    def get_fallback_response() -> WinPredictionResultSchema:
        return WinPredictionResultSchema(
            homeWinProb=FALLBACK_HOME_WIN_PROB,
            scorePredict=FALLBACK_SCORE_PREDICT,
            summary=WinPredictionSummarySchema(
                pitcherComparison=FALLBACK_COMMENT,
                battingComparison=FALLBACK_COMMENT,
                homeAdvantage=FALLBACK_COMMENT,
                headToHead=FALLBACK_COMMENT,
                keyPlayer=FALLBACK_COMMENT,
                weatherComment=FALLBACK_COMMENT,
            ),
        )