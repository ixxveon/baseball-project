from typing import Any, Protocol

from service.prediction.postgres_repository import PostgresPredictionRepository
from service.prediction.win_rate_estimator import calculate_weighted_win_rate

from service.preprocessor.stat_preprocessor import StatPreprocessor
from service.prompts.win_prediction_prompt import (
    WIN_PREDICTION_SYSTEM_PROMPT,
    build_llm_user_prompt,
)
from service.schemas.prediction_schema import (
    PreparePromptDataSchema,
    PreprocessedMatchupSchema,
    TeamStatSchema,
)


class PredictionRepository(Protocol):
    def get_matchup_stats(self, game_id: int) -> dict[str, Any]:
        ...


class PredictionService:
    def __init__(
            self,
            repository: PredictionRepository | None = None,
            preprocessor: StatPreprocessor | None = None,
    ):
        self.repository = repository or PostgresPredictionRepository()
        self.preprocessor = preprocessor or StatPreprocessor()

    def prepare_matchup_prompt(
            self,
            game_id: int,
    ) -> PreparePromptDataSchema:
        raw_stats = self.repository.get_matchup_stats(game_id)

        processed_stats = self.preprocessor.process_matchup_stats(
            raw_stats["home_hitter"],
            raw_stats["away_hitter"],
            raw_stats["home_pitcher"],
            raw_stats["away_pitcher"],
        )

        matchup_payload = PreprocessedMatchupSchema(
            gameId=game_id,
            homeTeam=TeamStatSchema(
                **processed_stats["homeTeam"],
            ),
            awayTeam=TeamStatSchema(
                **processed_stats["awayTeam"],
            ),
        )

        # StatPreprocessor는 DB 저장용 원자료(hitterWrcLast10, pitcherRaPerIpLast10 등)만
        # 계산한다. 승률은 두 팀을 동시에 비교해야 나오는 예측값이라 여기(prediction
        # 레이어)에서, 상대 투수 보정 가중치를 반영해 별도로 계산한다.
        home_win_rate = calculate_weighted_win_rate(processed_stats)

        # build_llm_user_prompt는
        # (home_win_rate: float, processed_stats: dict) 형태를 요구한다.
        user_prompt = build_llm_user_prompt(
            home_win_rate,
            processed_stats,
        )

        return PreparePromptDataSchema(
            systemPrompt=WIN_PREDICTION_SYSTEM_PROMPT,
            userPrompt=user_prompt,
            preprocessedMatchup=matchup_payload,
        )