from typing import Any, Protocol

from service.preprocessor.postgres_repository import PostgresPredictionRepository
from service.prompts.win_prediction_prompt import (
    WIN_PREDICTION_SYSTEM_PROMPT,
    build_llm_user_prompt,
)
from service.schemas.prediction_schema import (
    HitterStatSchema,
    PitcherStatSchema,
    PreparePromptDataSchema,
    PreprocessedMatchupSchema,
    TeamStatSchema,
)


class PredictionRepository(Protocol):
    def get_matchup_stats(self, game_id: int) -> dict[str, Any]:
        ...


class PredictionService:
    def __init__(self, repository: PredictionRepository | None = None):
        self.repository = repository or PostgresPredictionRepository()

    def prepare_matchup_prompt(self, game_id: int) -> PreparePromptDataSchema:
        raw_stats = self.repository.get_matchup_stats(game_id)

        home_team = TeamStatSchema(
            pitcher=self._pitcher_schema(raw_stats["home_pitcher"]),
            hitters=[self._hitter_schema(h) for h in raw_stats["home_hitters"]],
        )
        away_team = TeamStatSchema(
            pitcher=self._pitcher_schema(raw_stats["away_pitcher"]),
            hitters=[self._hitter_schema(h) for h in raw_stats["away_hitters"]],
        )

        matchup_payload = PreprocessedMatchupSchema(
            gameId=game_id,
            homeTeam=home_team,
            awayTeam=away_team,
        )

        user_prompt = build_llm_user_prompt(matchup_payload.model_dump())

        return PreparePromptDataSchema(
            systemPrompt=WIN_PREDICTION_SYSTEM_PROMPT,
            userPrompt=user_prompt,
            preprocessedMatchup=matchup_payload,
        )

    @staticmethod
    def _pitcher_schema(p: dict[str, Any]) -> PitcherStatSchema:
        return PitcherStatSchema(
            name=p["name"],
            ip=p["pitcher_ip"],
            era=p["pitcher_era"],
            recent10Ip=p.get("pitcher_recent10_ip"),
            recent10EarnedRuns=p.get("pitcher_recent10_earned_runs"),
        )

    @staticmethod
    def _hitter_schema(h: dict[str, Any]) -> HitterStatSchema:
        return HitterStatSchema(
            name=h["name"],
            pa=h["hitter_pa"],
            wrc=h["hitter_wrc"],
            recent10Pa=h.get("hitter_recent10_pa"),
            recent10Wrc=h.get("hitter_recent10_wrc"),
        )