import json
import openai

class LLMService:
    def __init__(self):
        self.client = openai.OpenAI()

    def generate_win_summary(self, system_prompt: str, user_prompt: str) -> dict:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,  # 👈 예측 결과 및 코멘트 일관성을 위해 낮게 고정
                response_format={"type": "json_object"}  # 👈 JSON 응답 강제
            )

            content = response.choices[0].message.content
            return json.loads(content)

        except Exception as e:
            # 👈 LLM 호출 실패, 타임아웃, JSON 파싱 실패 시 폴백(fallback) 동작
            return self._get_fallback_response()

    def _get_fallback_response(self):
        return {
            "summaryComment" : "AI 분석 서비스 연동이 일시적으로 지연되어 정량 스탯 기반 기본 분석 결과만 표시됩니다."
        }
        pass