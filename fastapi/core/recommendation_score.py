import pytest

from core.recommendation_score import (
    calculate_recommendation_score,
    calculate_weather_adjustment,
    win_prob_for_team,
)


@pytest.mark.parametrize(
    ("temperature", "humidity", "is_rain", "expected"),
    [
        (25.0, 50.0, None, 0),
        (25.0, 50.0, True, -90),
        (25.0, 50.0, False, 5),
        (33.0, 50.0, False, -15),
        (32.9, 50.0, False, 0),
        (25.0, 80.0, False, -5),
        (25.0, 79.9, False, 0),
        (33.0, 80.0, False, -25),
        (33.0, 80.0, True, -115),
        (20.0, 60.0, False, 5),
        (18.0, 69.9, False, 5),
        (17.9, 60.0, False, 0),
        (20.0, 70.0, False, 0),
        (20.0, 60.0, True, -90),
    ],
)
def test_calculate_weather_adjustment(temperature, humidity, is_rain, expected) -> None:
    assert calculate_weather_adjustment(temperature, humidity, is_rain) == expected


@pytest.mark.parametrize(
    ("win_prob", "weather_adjustment", "expected"),
    [
        (60.0, 0, 60),
        (60.0, -25, 35),
        (10.0, -90, 0),
        (95.0, 20, 100),
        (0.0, -10, 0),
        (100.0, 10, 100),
    ],
)
def test_calculate_recommendation_score_clamps_to_0_100(win_prob, weather_adjustment, expected) -> None:
    assert calculate_recommendation_score(win_prob, weather_adjustment) == expected


def test_win_prob_for_team_returns_home_win_prob_for_home_team() -> None:
    assert win_prob_for_team(home_win_prob=30.0, my_team_id=10, home_team_id=10) == 30.0


def test_win_prob_for_team_returns_inverse_for_away_team() -> None:
    assert win_prob_for_team(home_win_prob=30.0, my_team_id=20, home_team_id=10) == 70.0