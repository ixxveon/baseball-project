import pytest

from service.services.prediction_service import LoginRequiredError, PredictionService


class FakeRepository:
    def __init__(self, cached):
        self.cached = cached
        self.matchup_requested = False

    def get_cached_prediction(self, game_id):
        return self.cached

    def get_matchup_stats(self, game_id):
        self.matchup_requested = True
        raise AssertionError("비로그인 요청은 전처리 전에 막혀야 합니다.")


class FailIfCalledLLM:
    def generate_win_summary(self, system_prompt, user_prompt):
        raise AssertionError("비로그인 요청에서 LLM이 호출되면 안 됩니다.")


def test_guest_without_saved_analysis_is_blocked_before_any_work():
    repository = FakeRepository(cached=None)
    service = PredictionService(repository=repository, llm_service=FailIfCalledLLM(), weather_service=object())

    with pytest.raises(LoginRequiredError):
        service.predict(game_id=1, allow_generate=False)

    assert repository.matchup_requested is False
