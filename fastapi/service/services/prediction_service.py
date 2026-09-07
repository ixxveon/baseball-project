from typing import Any, Protocol

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


class MockPredictionRepository:
    """
    PostgreSQL(progressSQL) 연결 전 API 테스트를 위한 임시 Repository.
    """

    def get_matchup_stats(self, game_id: int) -> dict[str, Any]:
        return {
            "home_hitter": {
                "hitter_wrc": 45.0,
                "hitter_pa": 120,
                "hitter_wrc_history": [
                    40.0,
                    38.0,
                    35.0,
                    30.0,
                    25.0,
                    20.0,
                    15.0,
                    10.0,
                    5.0,
                    0.0,
                ],
            },
            "away_hitter": {
                "hitter_wrc": 30.0,
                "hitter_pa": 110,
                "hitter_wrc_history": [
                    28.0,
                    26.0,
                    25.0,
                    22.0,
                    20.0,
                    18.0,
                    15.0,
                    12.0,
                    8.0,
                    2.0,
                ],
            },
            "home_pitcher": {
                "pitcher_era": 2.50,
                "pitcher_ip": 50.0,
                "pitcher_era_history": [
                    3.00,
                    2.80,
                    2.70,
                    2.60,
                    2.50,
                    2.40,
                    2.30,
                    2.20,
                    2.10,
                    2.00,
                ],
                "pitcher_ip_history": [
                    6.0,
                    6.0,
                    7.0,
                    6.0,
                    7.0,
                    6.0,
                    7.0,
                    6.0,
                    7.0,
                    6.0,
                ],
            },
            "away_pitcher": {
                "pitcher_era": 4.10,
                "pitcher_ip": 42.0,
                "pitcher_era_history": [
                    4.50,
                    4.40,
                    4.30,
                    4.20,
                    4.10,
                    4.00,
                    3.90,
                    3.80,
                    3.70,
                    3.60,
                ],
                "pitcher_ip_history": [
                    5.0,
                    6.0,
                    5.0,
                    6.0,
                    5.0,
                    6.0,
                    5.0,
                    6.0,
                    5.0,
                    6.0,
                ],
            },
        }


class PredictionService:
    def __init__(
            self,
            repository: PredictionRepository,
            preprocessor: StatPreprocessor | None = None,
    ):
        self.repository = repository
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

        # Pythagorean 계산에서 나온 홈팀 승률을 사용한다.
        home_win_rate = processed_stats["homeTeam"]["winRate"]

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