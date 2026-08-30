from typing import Any

from pydantic import BaseModel


class TeamStatSchema(BaseModel):
    hitterWrcLast10: float
    pitcherEraLast10: float
    pa: int
    ip: float


class PreprocessedMatchupSchema(BaseModel):
    gameId: int
    homeTeam: TeamStatSchema
    awayTeam: TeamStatSchema


class WinPredictionRequest(BaseModel):
    gameId: int


class ApiResponse(BaseModel):
    success: bool
    status: int
    message: str
    data: dict[str, Any] | None = None