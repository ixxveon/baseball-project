from typing import Generic, TypeVar

from pydantic import BaseModel, Field


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


class WeatherSchema(BaseModel):
    temperature: float
    humidity: float
    condition: str  # "맑음"/"구름많음"/"비"/"눈"/"뇌우" 등
    isRain: bool


class PreprocessedMatchupSchema(BaseModel):
    gameId: int
    homeTeam: TeamStatSchema
    awayTeam: TeamStatSchema
    headToHead: HeadToHeadSchema
    keyPlayers: list[KeyPlayerSchema]
    weather: WeatherSchema | None = None  # 예보 범위 밖이면 None


class WinPredictionRequest(BaseModel):
    gameId: int


class UpcomingGameSchema(BaseModel):
    gameId: int
    matchDate: str
    matchTime: str
    homeTeamId: int
    homeTeamName: str
    awayTeamId: int
    awayTeamName: str
    recommendationScore: int | None = None  # 오늘 배치가 미리 계산해뒀으면 값, 아니면 None


class RecentRecordSchema(BaseModel):
    wins: int
    losses: int
    gamesCount: int
    winRate: int  # 0~100
    avgScored: float
    avgAllowed: float


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
    weatherComment: str


class WinPredictionResultSchema(BaseModel):
    homeWinProb: float = Field(ge=0, le=100)
    scorePredict: str = Field(pattern=r"^(\d+:\d+|-:-)$")
    summary: WinPredictionSummarySchema


class PredictionResultDataSchema(BaseModel):
    gameId: int
    preprocessedMatchup: PreprocessedMatchupSchema
    result: WinPredictionResultSchema
    recommendationScore: int


T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    status: int
    message: str
    data: T | None = None