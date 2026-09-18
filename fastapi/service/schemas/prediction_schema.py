from typing import Generic, TypeVar

from pydantic import BaseModel


class PitcherStatSchema(BaseModel):
    name: str
    ip: float
    era: float
    recent10Ip: float | None = None
    recent10EarnedRuns: float | None = None


class HitterStatSchema(BaseModel):
    name: str
    pa: int
    wrc: float
    recent10Pa: int | None = None
    recent10Wrc: float | None = None


class TeamStatSchema(BaseModel):
    pitcher: PitcherStatSchema
    hitters: list[HitterStatSchema]


class HeadToHeadSchema(BaseModel):
    homeWins: int
    awayWins: int


class KeyPlayerSchema(BaseModel):
    name: str
    side: str  # "home" | "away"
    recentWrc: float


class PreprocessedMatchupSchema(BaseModel):
    gameId: int
    homeTeam: TeamStatSchema
    awayTeam: TeamStatSchema
    headToHead: HeadToHeadSchema
    keyPlayers: list[KeyPlayerSchema]


class WinPredictionRequest(BaseModel):
    gameId: int


class PreparePromptDataSchema(BaseModel):
    systemPrompt: str
    userPrompt: str
    preprocessedMatchup: PreprocessedMatchupSchema


class WinPredictionSummarySchema(BaseModel):
    pitcherComparison: str
    battingComparison: str
    homeAdvantage: str
    headToHead: str
    keyPlayer: str


class WinPredictionResultSchema(BaseModel):
    homeWinProb: float
    scorePredict: str
    summary: WinPredictionSummarySchema


class PredictionResultDataSchema(BaseModel):
    gameId: int
    preprocessedMatchup: PreprocessedMatchupSchema
    result: WinPredictionResultSchema


T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    status: int
    message: str
    data: T | None = None