from typing import Any, Protocol

from core.llm_service import LLMGenerationError, LLMService
from core.recommendation_score import (
    calculate_recommendation_score,
    calculate_weather_adjustment,
)
from core.weather_service import WeatherService
from service.preprocessor.postgres_repository import PostgresPredictionRepository
from service.prompts.win_prediction_prompt import (
    WIN_PREDICTION_SYSTEM_PROMPT,
    build_llm_user_prompt,
)
from service.schemas.prediction_schema import (
    HeadToHeadSchema,
    HitterStatSchema,
    KeyPlayerSchema,
    PitcherStatSchema,
    PredictionResultDataSchema,
    PreparePromptDataSchema,
    PreprocessedMatchupSchema,
    RecentRecordSchema,
    TeamStatSchema,
    UpcomingGameSchema,
    WeatherSchema,
    WinPredictionResultSchema,
)


class PredictionRepository(Protocol):
    def get_matchup_stats(self, game_id: int) -> dict[str, Any]:
        ...

    def save_prediction(self, game_id: int, home_win_prob: float, result_json: dict[str, Any]) -> None:
        ...

    def get_cached_prediction(self, game_id: int) -> dict[str, Any] | None:
        ...

    def get_upcoming_games(self) -> list[dict[str, Any]]:
        ...

    def get_recent_team_record(self, team_id: int, limit: int = 10) -> dict[str, Any]:
        ...


class PredictionService:
    def __init__(
            self,
            repository: PredictionRepository | None = None,
            llm_service: LLMService | None = None,
            weather_service: WeatherService | None = None,
    ):
        self.repository = repository or PostgresPredictionRepository()
        self.llm_service = llm_service or LLMService()
        self.weather_service = weather_service or WeatherService()

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

        head_to_head = HeadToHeadSchema(
            homeWins=raw_stats["head_to_head"]["homeWins"],
            awayWins=raw_stats["head_to_head"]["awayWins"],
        )

        key_players = [
            p for p in (
                self._pick_key_player(raw_stats["home_hitters"], "home"),
                self._pick_key_player(raw_stats["away_hitters"], "away"),
            ) if p is not None
        ]

        weather = self._fetch_weather(raw_stats)

        matchup_payload = PreprocessedMatchupSchema(
            gameId=game_id,
            homeTeam=home_team,
            awayTeam=away_team,
            headToHead=head_to_head,
            keyPlayers=key_players,
            weather=weather,
        )

        user_prompt = build_llm_user_prompt(matchup_payload.model_dump())

        return PreparePromptDataSchema(
            systemPrompt=WIN_PREDICTION_SYSTEM_PROMPT,
            userPrompt=user_prompt,
            preprocessedMatchup=matchup_payload,
        )

    def predict(self, game_id: int) -> PredictionResultDataSchema:
        prompt_data = self.prepare_matchup_prompt(game_id)

        weather = prompt_data.preprocessedMatchup.weather
        weather_adjustment = calculate_weather_adjustment(
            temperature=weather.temperature if weather else None,
            humidity=weather.humidity if weather else None,
            is_rain=weather.isRain if weather else None,
        )

        cached = self.repository.get_cached_prediction(game_id)
        if cached is not None:
            result = WinPredictionResultSchema.model_validate(cached["result_json"])
            recommendation_score = calculate_recommendation_score(result.homeWinProb, weather_adjustment)
        else:
            try:
                result = self.llm_service.generate_win_summary(
                    prompt_data.systemPrompt,
                    prompt_data.userPrompt,
                )
                recommendation_score = calculate_recommendation_score(result.homeWinProb, weather_adjustment)
                self.repository.save_prediction(
                    game_id=game_id,
                    home_win_prob=result.homeWinProb,
                    result_json=result.model_dump(),
                    recommendation_score=recommendation_score,
                )
            except LLMGenerationError:
                result = LLMService.get_fallback_response()
                recommendation_score = calculate_recommendation_score(result.homeWinProb, weather_adjustment)

        return PredictionResultDataSchema(
            gameId=game_id,
            preprocessedMatchup=prompt_data.preprocessedMatchup,
            recommendationScore=recommendation_score,
            result=result,
        )

    def get_upcoming_games(self) -> list[UpcomingGameSchema]:
        raw_games = self.repository.get_upcoming_games()
        return [
            UpcomingGameSchema(
                gameId=g["game_id"],
                matchDate=str(g["match_date"]),
                matchTime=str(g["match_time"]),
                homeTeamId=g["home_team_id"],
                homeTeamName=g["home_team_name"],
                awayTeamId=g["away_team_id"],
                awayTeamName=g["away_team_name"],
                recommendationScore=g.get("recommendation_score"),
            )
            for g in raw_games
        ]

    def get_recent_team_record(self, team_id: int) -> RecentRecordSchema:
        raw = self.repository.get_recent_team_record(team_id, limit=10)
        decisions = raw["wins"] + raw["losses"]
        win_rate = round((raw["wins"] / decisions) * 100) if decisions else 0
        return RecentRecordSchema(
            wins=raw["wins"],
            losses=raw["losses"],
            gamesCount=raw["games_count"],
            winRate=win_rate,
            avgScored=raw["avg_scored"],
            avgAllowed=raw["avg_allowed"],
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

    @staticmethod
    def _pick_key_player(hitters: list[dict[str, Any]], side: str) -> KeyPlayerSchema | None:
        if not hitters:
            return None

        def score(h: dict[str, Any]) -> float:
            recent = h.get("hitter_recent10_wrc")
            return recent if recent is not None else h["hitter_wrc"]

        best = max(hitters, key=score)
        return KeyPlayerSchema(name=best["name"], side=side, recentWrc=score(best))

    def _fetch_weather(self, raw_stats: dict[str, Any]) -> WeatherSchema | None:
        try:
            forecast = self.weather_service.get_forecast(
                lat=raw_stats["stadium_latitude"],
                lon=raw_stats["stadium_longitude"],
                target_date=raw_stats["match_date"],
            )
        except Exception:  # noqa: BLE001 - 날씨 조회 실패는 예측 전체를 막을 이유가 없음(중립 처리)
            return None

        if forecast is None:
            return None

        return WeatherSchema(
            temperature=forecast["temperature"],
            humidity=forecast["humidity"],
            condition=forecast["condition_label"],
            isRain=forecast["is_rain"],
        )