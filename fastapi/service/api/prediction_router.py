from fastapi import APIRouter

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


def _error_example(description: str, message: str) -> dict:
    return {
        "description": description,
        "content": {
            "application/json": {
                "example": {
                    "success": False,
                    "message": message,
                    "data": None,
                }
            }
        },
    }


COMMON_ERRORS = {
    422: _error_example("요청 값 검증 실패", "요청 값이 올바르지 않습니다."),
    500: _error_example(
        "서버 내부 오류",
        "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    ),
}


@router.get(
    "/teams/{team_id}/recent-record",
    response_model=ApiResponse[RecentRecordSchema],
    summary="팀 최근 10경기 전적 조회",
    description="지정한 팀의 최근 10경기 승/패/무 기록을 반환합니다.",
    responses={
        400: _error_example("잘못된 요청 (예: 존재하지 않는 팀)", "팀을 찾을 수 없습니다."),
        **COMMON_ERRORS,
    },
)
def get_recent_team_record(team_id: int):
    result = prediction_service.get_recent_team_record(team_id=team_id)

    return ApiResponse[RecentRecordSchema](
        success=True,
        message="최근 10경기 전적 조회가 완료되었습니다.",
        data=result,
    )


@router.get(
    "/games",
    response_model=ApiResponse[list[UpcomingGameSchema]],
    summary="예정 경기 목록 조회",
    description="승률 예측이 가능한 예정 경기 목록을 반환합니다.",
    responses={500: COMMON_ERRORS[500]},
)
def get_upcoming_games():
    result = prediction_service.get_upcoming_games()

    return ApiResponse[list[UpcomingGameSchema]](
        success=True,
        message="예정 경기 목록 조회가 완료되었습니다.",
        data=result,
    )


@router.post(
    "/prepare-prompt",
    response_model=ApiResponse[PreparePromptDataSchema],
    summary="예측용 프롬프트 준비 (내부용)",
    description="gameId 기준으로 데이터를 전처리하고 AI 예측용 프롬프트를 생성합니다. 디버그용입니다.",
    include_in_schema=False,
    responses={
        400: _error_example("잘못된 요청 (예: 존재하지 않는 경기)", "경기를 찾을 수 없습니다."),
        **COMMON_ERRORS,
    },
)
def prepare_matchup_prompt(
        payload: WinPredictionRequest,
):
    result = prediction_service.prepare_matchup_prompt(
        game_id=payload.gameId,
    )

    return ApiResponse[PreparePromptDataSchema](
        success=True,
        message="데이터 전처리 및 프롬프트 준비가 완료되었습니다.",
        data=result,
    )


@router.post(
    "/predict",
    response_model=ApiResponse[PredictionResultDataSchema],
    summary="경기 승률 예측",
    description="gameId에 해당하는 경기의 AI 승률 예측 결과를 반환합니다.",
    responses={
        400: _error_example("잘못된 요청 (예: 존재하지 않는 경기)", "경기를 찾을 수 없습니다."),
        **COMMON_ERRORS,
    },
)
def predict_win_rate(
        payload: WinPredictionRequest,
):
    result = prediction_service.predict(
        game_id=payload.gameId,
    )

    return ApiResponse[PredictionResultDataSchema](
        success=True,
        message="AI 승률 분석이 완료되었습니다.",
        data=result,
    )