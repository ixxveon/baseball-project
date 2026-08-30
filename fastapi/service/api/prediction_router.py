from fastapi import APIRouter, HTTPException, status

from service.preprocessor.stat_preprocessor import StatPreprocessor
from service.prompts.win_prediction_prompt import (
    WIN_PREDICTION_SYSTEM_PROMPT,
    build_llm_user_prompt,
)
from service.schemas.prediction_schema import ApiResponse, WinPredictionRequest

router = APIRouter(prefix="/api/v1/ai", tags=["AI Prediction"])
preprocessor = StatPreprocessor()

@router.post("/prepare-prompt", response_model=ApiResponse)
def prepare_matchup_prompt(payload: WinPredictionRequest):
    try:
        mock_home_hitter = {
            "hitter_wrc": 45.0,
            "hitter_pa": 120,
            "hitter_wrc_history": [40.0, 38.0, 35.0, 30.0, 25.0, 20.0, 15.0, 10.0, 5.0, 0.0],
        }
        mock_away_hitter = {
            "hitter_wrc": 30.0,
            "hitter_pa": 110,
            "hitter_wrc_history": [28.0, 26.0, 25.0, 22.0, 20.0, 18.0, 15.0, 12.0, 8.0, 2.0],
        }
        mock_home_pitcher = {
            "pitcher_era": 2.50,
            "pitcher_ip": 50.0,
            "pitcher_era_history": [3.00, 2.80, 2.50],
        }
        mock_away_pitcher = {
            "pitcher_era": 4.10,
            "pitcher_ip": 42.0,
            "pitcher_era_history": [4.50, 4.20, 4.10],
        }

        processed_stats = preprocessor.process_matchup_stats(
            mock_home_hitter, mock_away_hitter, mock_home_pitcher, mock_away_pitcher
        )

        matchup_payload = {
            "gameId": payload.gameId,
            "homeTeam": processed_stats["homeTeam"],
            "awayTeam": processed_stats["awayTeam"],
        }

        user_prompt = build_llm_user_prompt(matchup_payload)

        return ApiResponse(
            success=True,
            status=status.HTTP_200_OK,
            message="데이터 전처리 및 프롬프트 준비가 완료되었습니다.",
            data={
                "systemPrompt": WIN_PREDICTION_SYSTEM_PROMPT,
                "userPrompt": user_prompt,
                "preprocessedMatchup": matchup_payload,
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "status": 500,
                "message": f"전처리 도중 오류 발생: {e!s}",
                "data": None,
            },
        ) from e