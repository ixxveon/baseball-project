def calculate_weather_adjustment(
        temperature: float | None,
        humidity: float | None,
        is_rain: bool | None,
) -> int:
    """
    날씨 보정치. 예보 자체가 없으면(is_rain=None) 중립(0).
    구름(Clouds)은 점수에 반영하지 않는다 - 코멘트에서만 언급.
    """
    if is_rain is None:
        return 0

    adjustment = 0

    if is_rain:
        adjustment -= 90  # 비/눈/뇌우 - 직관 의미 없는 수준으로 감점

    is_heatwave = temperature is not None and temperature >= 33
    is_humid = humidity is not None and humidity >= 80

    if is_heatwave:
        adjustment -= 15
    if is_humid:
        adjustment -= 5
    if is_heatwave and is_humid:
        adjustment -= 5

    is_pleasant = (
            not is_rain
            and temperature is not None and 18 <= temperature <= 26
            and humidity is not None and humidity < 70
    )
    if is_pleasant:
        adjustment += 5

    return adjustment


def calculate_recommendation_score(win_prob_for_my_team: float, weather_adjustment: int) -> int:
    score = win_prob_for_my_team + weather_adjustment
    return max(0, min(100, round(score)))


def win_prob_for_team(home_win_prob: float, my_team_id: int, home_team_id: int) -> float:
    if my_team_id == home_team_id:
        return home_win_prob
    return 100 - home_win_prob