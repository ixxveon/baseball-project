from datetime import date, datetime
from zoneinfo import ZoneInfo

import httpx

KST = ZoneInfo("Asia/Seoul")

# OpenWeather 'main' 값 -> 한국어 표기
CONDITION_LABELS = {
    "Clear": "맑음",
    "Clouds": "구름많음",
    "Rain": "비",
    "Drizzle": "약한 비",
    "Thunderstorm": "뇌우",
    "Snow": "눈",
    "Mist": "안개", "Fog": "안개", "Haze": "안개",
}

RAIN_CONDITIONS = {"Rain", "Drizzle", "Thunderstorm", "Snow"}


class WeatherFetchError(Exception):
    pass


class WeatherService:
    """
    OpenWeather 5 Day / 3 Hour Forecast API 연동.
    무료 플랜 기준 대략 +5일까지만 제공되므로, 그 이후 날짜는 get_forecast()가 None을 반환한다.
    """

    BASE_URL = "https://api.openweathermap.org/data/2.5/forecast"

    def __init__(self, api_key: str | None = None):
        import os
        self._api_key_override = api_key
        self._env_key = lambda: os.environ.get("OPENWEATHER_API_KEY")

    @property
    def api_key(self) -> str:
        key = self._api_key_override or self._env_key()
        if not key:
            raise RuntimeError("필수 환경변수 OPENWEATHER_API_KEY가 설정되지 않았습니다.")
        return key

    def get_forecast(self, lat: float, lon: float, target_date: date, target_hour: int = 18) -> dict | None:
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric",
            "lang": "kr",
        }

        try:
            response = httpx.get(self.BASE_URL, params=params, timeout=5.0)
            response.raise_for_status()
            payload = response.json()
        except (httpx.HTTPError, ValueError) as e:
            raise WeatherFetchError(str(e)) from e

        try:
            blocks = payload["list"]
        except (KeyError, TypeError) as e:
            raise WeatherFetchError(f"OpenWeather 응답 형식이 예상과 다릅니다: {payload}") from e

        target_dt = datetime(
            target_date.year, target_date.month, target_date.day, target_hour,
            tzinfo=KST,
        )

        closest = None
        closest_diff = None
        for block in blocks:
            block_dt = datetime.fromtimestamp(block["dt"], tz=KST)
            diff = abs((block_dt - target_dt).total_seconds())
            if closest_diff is None or diff < closest_diff:
                closest = block
                closest_diff = diff

        # 예보 제공 범위(대략 5일) 밖이면 가장 가까운 블록도 몇 시간 이상 차이나므로 컷오프
        if closest is None or closest_diff > 3 * 3600 + 1800:
            return None

        main_condition = closest["weather"][0]["main"]
        return {
            "temperature": closest["main"]["temp"],
            "humidity": closest["main"]["humidity"],
            "condition_main": main_condition,
            "condition_label": CONDITION_LABELS.get(main_condition, main_condition),
            "is_rain": main_condition in RAIN_CONDITIONS,
        }