from typing import Any, Protocol

from service.preprocessor.postgres_repository import PostgresPredictionRepository
from service.preprocessor.stat_preprocessor import StatPreprocessor
from service.preprocessor.win_rate_estimator import calculate_weighted_win_rate
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

        home_win_rate = calculate_weighted_win_rate(processed_stats)


        user_prompt = build_llm_user_prompt(
            home_win_rate,
            processed_stats,
        )

        return PreparePromptDataSchema(
            systemPrompt=WIN_PREDICTION_SYSTEM_PROMPT,
            userPrompt=user_prompt,
            preprocessedMatchup=matchup_payload,
        )