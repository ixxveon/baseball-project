from fastapi import APIRouter, HTTPException, status

from service.schemas.prediction_schema import (
    ApiResponse,
    PredictionResultDataSchema,
    PreparePromptDataSchema,
    RecentRecordSchema,
    UpcomingGameSchema,
    WinPredictionRequest,
)
from service.services.prediction_service import PredictionService

router = APIRouter(
    prefix="/ai",
    tags=["AI Prediction"],
)

prediction_service = PredictionService()


@router.get(
    "/teams/{team_id}/recent-record",
    response_model=ApiResponse[RecentRecordSchema],
)
def get_recent_team_record(team_id: int):
    try:
        result = prediction_service.get_recent_team_record(team_id=team_id)

        return ApiResponse[RecentRecordSchema](
            success=True,
            status=status.HTTP_200_OK,
            message="최근 10경기 전적 조회가 완료되었습니다.",
            data=result,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        ) from e


@router.get(
    "/games",
    response_model=ApiResponse[list[UpcomingGameSchema]],
)
def get_upcoming_games():
    try:
        result = prediction_service.get_upcoming_games()

        return ApiResponse[list[UpcomingGameSchema]](
            success=True,
            status=status.HTTP_200_OK,
            message="예정 경기 목록 조회가 완료되었습니다.",
            data=result,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        ) from e


@router.post(
    "/prepare-prompt",
    response_model=ApiResponse[PreparePromptDataSchema],
)
def prepare_matchup_prompt(
        payload: WinPredictionRequest,
):
    try:
        result = prediction_service.prepare_matchup_prompt(
            game_id=payload.gameId,
        )

        return ApiResponse[PreparePromptDataSchema](
            success=True,
            status=status.HTTP_200_OK,
            message="데이터 전처리 및 프롬프트 준비가 완료되었습니다.",
            data=result,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        ) from e


@router.post(
    "/predict",
    response_model=ApiResponse[PredictionResultDataSchema],
)
def predict_win_rate(
        payload: WinPredictionRequest,
):
    try:
        result = prediction_service.predict(
            game_id=payload.gameId,
        )

        return ApiResponse[PredictionResultDataSchema](
            success=True,
            status=status.HTTP_200_OK,
            message="AI 승률 분석이 완료되었습니다.",
            data=result,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        ) from e