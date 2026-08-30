from pydantic import BaseModel
from typing import Dict, Any, Optional

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
    data: Optional[Dict[str, Any]] = None