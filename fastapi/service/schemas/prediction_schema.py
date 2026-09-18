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