import json
from json import JSONDecodeError
import openai
from openai import APIError


class LLMService:

    def __init__(self):
        self.client = openai.OpenAI()

    def generate_win_summary(self, system_prompt: str, user_prompt: str) -> dict:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )

            content = response.choices[0].message.content
            return json.loads(content)

        except (APIError, JSONDecodeError):
            return self._get_fallback_response()

    def _get_fallback_response(self) -> dict:
        return {
            "summaryComment": "AI 분석 서비스 연동이 일시적으로 지연되어 정량 스탯 기반 기본 분석 결과만 표시됩니다."
        }