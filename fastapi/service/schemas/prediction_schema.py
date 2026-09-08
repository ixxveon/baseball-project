from typing import Generic, TypeVar

from pydantic import BaseModel


class TeamStatSchema(BaseModel):
    hitterWrcLast10: float
    pitcherRaPerIpLast10: float
    winRate: float
    pa: int
    ip: float


class PreprocessedMatchupSchema(BaseModel):
    gameId: int
    homeTeam: TeamStatSchema
    awayTeam: TeamStatSchema


class WinPredictionRequest(BaseModel):
    gameId: int


class PreparePromptDataSchema(BaseModel):
    systemPrompt: str
    userPrompt: str
    preprocessedMatchup: PreprocessedMatchupSchema


T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    status: int
    message: str
    data: T | None = None