import json

import anthropic

from service.schemas.prediction_schema import WinPredictionResultSchema

FALLBACK_HOME_WIN_PROB = 50.0
FALLBACK_SUMMARY_COMMENT = "AI 분석 서비스 연동이 일시적으로 지연되어 정량 스탯 기반 기본 분석 결과만 표시됩니다."


class LLMGenerationError(Exception):
    pass


class LLMService:
    def __init__(self, model: str = "claude-sonnet-5"):
        self.model = model
        self._client: anthropic.Anthropic | None = None

    @property
    def client(self) -> anthropic.Anthropic:
        if self._client is None:
            self._client = anthropic.Anthropic()
        return self._client

    def generate_win_summary(self, system_prompt: str, user_prompt: str) -> WinPredictionResultSchema:
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                temperature=0.2,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt},
                ],
            )

            content = "".join(
                block.text for block in response.content if getattr(block, "type", None) == "text"
            )
            if not content:
                raise LLMGenerationError("LLM 응답에 텍스트 content가 없습니다.")

            parsed = json.loads(content)
            return WinPredictionResultSchema.model_validate(parsed)

        except (anthropic.AnthropicError, json.JSONDecodeError, TypeError, ValueError) as e:
            raise LLMGenerationError(str(e)) from e

    @staticmethod
    def get_fallback_response() -> WinPredictionResultSchema:
        return WinPredictionResultSchema(
            homeWinProb=FALLBACK_HOME_WIN_PROB,
            summaryComment=FALLBACK_SUMMARY_COMMENT,
        )
