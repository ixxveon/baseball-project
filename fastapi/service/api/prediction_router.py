from fastapi import APIRouter, HTTPException, status

from service.schemas.prediction_schema import (
    ApiResponse,
    PreparePromptDataSchema,
    WinPredictionRequest,
)
from service.services.prediction_service import (
    MockPredictionRepository,
    PredictionService,
)

router = APIRouter(
    prefix="/ai",
    tags=["AI Prediction"],
)

prediction_service = PredictionService(
    repository=MockPredictionRepository(),
)


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
