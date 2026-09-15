"""
전처리 결과(hitterWrcLast10, pitcherRaPerIpLast10)를 바탕으로,
'상대 투수 보정'을 반영해 승률을 계산한다.

DB 저장용 전처리(StatPreprocessor)와 분리한 이유:
  - 이 값은 두 팀을 동시에 비교해야 나오는 예측값이라 원자료 정제와 성격이 다름
  - 공식이 앞으로 계속 개선될 수 있는데, DB에 저장된 원자료를 건드리지 않고
    이 파일만 바꾸면 되도록 하기 위함
  - 경기당 1회성 파생값이라 DB에 저장해서 재사용할 이유가 없음
"""
import math

# KBO 평균 ERA(약 4.50) 기준. 실제 리그 평균으로 교체 가능하도록 상수로 분리.
LEAGUE_AVG_RA_PER_IP = 0.50

PYTHAGOREAN_EXPONENT = 1.83


def calculate_weighted_win_rate(processed_stats: dict) -> float:
    home = processed_stats["homeTeam"]
    away = processed_stats["awayTeam"]

    home_wrc = max(0.0, home["hitterWrcLast10"])
    away_wrc = max(0.0, away["hitterWrcLast10"])
    home_ra_per_ip = max(0.0, home["pitcherRaPerIpLast10"])
    away_ra_per_ip = max(0.0, away["pitcherRaPerIpLast10"])

    home_expected = home_wrc * (away_ra_per_ip / LEAGUE_AVG_RA_PER_IP)
    away_expected = away_wrc * (home_ra_per_ip / LEAGUE_AVG_RA_PER_IP)

    home_pow = math.pow(home_expected, PYTHAGOREAN_EXPONENT)
    away_pow = math.pow(away_expected, PYTHAGOREAN_EXPONENT)

    total = home_pow + away_pow
    if total == 0:
        return 0.50

    return round(home_pow / total, 2)