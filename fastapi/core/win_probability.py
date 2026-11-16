
from dataclasses import dataclass
from typing import Any

PYTHAGOREAN_EXPONENT = 1.83
RECENT_WEIGHT = 0.6         # 최근 10경기 가중치 (나머지는 시즌 성적). 0.5보다 크면 최근 성적을 더 중시
STARTER_WEIGHT = 0.55       # 선발투수가 경기에서 차지하는 비중 (보정 강도)
FACTOR_MIN = 0.70
FACTOR_MAX = 1.30
LEAGUE_RUNS_PER_GAME = 5.8  # 리그 팀 경기당 평균 득점 (games 테이블 기준으로 보정)
LEAGUE_WRC_PER_PA = 0.21    # 리그 팀 평균 타석당 wRC (hitter_stats 기준, 데이터 없을 때 대체값으로도 사용)
LEAGUE_ERA = 4.20           # 리그 선발 평균 ERA (보정 기준)


@dataclass(frozen=True)
class WinEstimate:
    home_win_prob: float
    score_predict: str
    home_expected_runs: float
    away_expected_runs: float
    home_wrc_per_pa: float
    away_wrc_per_pa: float
    home_recent_wrc_per_pa: float
    away_recent_wrc_per_pa: float
    home_starter_era: float
    away_starter_era: float
    home_starter_recent_era: float
    away_starter_recent_era: float

    def as_prompt_dict(self) -> dict[str, Any]:
        return {
            "homeWinProb": self.home_win_prob,
            "scorePredict": self.score_predict,
            "homeExpectedRuns": round(self.home_expected_runs, 2),
            "awayExpectedRuns": round(self.away_expected_runs, 2),
            "homeWrcPerPa": round(self.home_wrc_per_pa, 3),
            "awayWrcPerPa": round(self.away_wrc_per_pa, 3),
            "homeRecentWrcPerPa": round(self.home_recent_wrc_per_pa, 3),
            "awayRecentWrcPerPa": round(self.away_recent_wrc_per_pa, 3),
            "homeStarterEra": round(self.home_starter_era, 2),
            "awayStarterEra": round(self.away_starter_era, 2),
            "homeStarterRecentEra": round(self.home_starter_recent_era, 2),
            "awayStarterRecentEra": round(self.away_starter_recent_era, 2),
        }


def _num(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _rate(pairs: list[tuple[float, float]]) -> float | None:
    """(wrc, pa) 목록의 Σwrc / Σpa. 타석이 없으면 None."""
    total_pa = sum(pa for _, pa in pairs)
    if total_pa <= 0:
        return None
    return sum(wrc for wrc, _ in pairs) / total_pa


def team_batting(hitters: list[dict[str, Any]]) -> tuple[float, float]:
    """(블렌드 타석당 wRC, 최근 10경기 타석당 wRC) 반환."""
    recent: list[tuple[float, float]] = []
    season: list[tuple[float, float]] = []
    for h in hitters:
        pa, wrc = _num(h.get("hitter_recent10_pa")), _num(h.get("hitter_recent10_wrc"))
        if pa is not None and pa > 0 and wrc is not None:
            recent.append((wrc, pa))
        pa, wrc = _num(h.get("hitter_pa")), _num(h.get("hitter_wrc"))
        if pa is not None and pa > 0 and wrc is not None:
            season.append((wrc, pa))

    season_rate = _rate(season)
    recent_rate = _rate(recent)
    if season_rate is None and recent_rate is None:
        return LEAGUE_WRC_PER_PA, LEAGUE_WRC_PER_PA
    if season_rate is None:
        season_rate = recent_rate
    if recent_rate is None:
        recent_rate = season_rate
    blended = RECENT_WEIGHT * recent_rate + (1 - RECENT_WEIGHT) * season_rate
    return blended, recent_rate


def starter_era(pitcher: dict[str, Any]) -> tuple[float, float]:
    """(블렌드 ERA, 최근 10경기 9이닝당 자책) 반환."""
    ip, er = _num(pitcher.get("pitcher_recent10_ip")), _num(pitcher.get("pitcher_recent10_earned_runs"))
    recent = er / ip * 9 if ip is not None and ip > 0 and er is not None else None
    season = _num(pitcher.get("pitcher_era"))

    if season is None and recent is None:
        return LEAGUE_ERA, LEAGUE_ERA
    if season is None:
        season = recent
    if recent is None:
        recent = season
    blended = RECENT_WEIGHT * recent + (1 - RECENT_WEIGHT) * season
    return blended, recent


def pitcher_factor(era: float) -> float:
    factor = 1 + STARTER_WEIGHT * (era / LEAGUE_ERA - 1)
    return max(FACTOR_MIN, min(FACTOR_MAX, factor))


def _score_predict(home_runs: float, away_runs: float) -> str:
    home = int(home_runs + 0.5)
    away = int(away_runs + 0.5)
    if home == away:  # 예상 스코어는 승률 우세 쪽이 이기도록 맞춘다
        if home_runs >= away_runs:
            home += 1
        else:
            away += 1
    return f"{home}:{away}"


def estimate_win(
        home_hitters: list[dict[str, Any]],
        away_hitters: list[dict[str, Any]],
        home_pitcher: dict[str, Any],
        away_pitcher: dict[str, Any],
) -> WinEstimate:
    home_rate, home_recent_rate = team_batting(home_hitters)
    away_rate, away_recent_rate = team_batting(away_hitters)
    home_era, home_recent_era = starter_era(home_pitcher)
    away_era, away_recent_era = starter_era(away_pitcher)

    # 홈 타선은 원정 선발을, 원정 타선은 홈 선발을 상대한다
    home_runs = LEAGUE_RUNS_PER_GAME * (home_rate / LEAGUE_WRC_PER_PA) * pitcher_factor(away_era)
    away_runs = LEAGUE_RUNS_PER_GAME * (away_rate / LEAGUE_WRC_PER_PA) * pitcher_factor(home_era)

    home_pow = home_runs ** PYTHAGOREAN_EXPONENT
    away_pow = away_runs ** PYTHAGOREAN_EXPONENT
    home_win_prob = round(home_pow / (home_pow + away_pow) * 100, 1)

    return WinEstimate(
        home_win_prob=home_win_prob,
        score_predict=_score_predict(home_runs, away_runs),
        home_expected_runs=home_runs,
        away_expected_runs=away_runs,
        home_wrc_per_pa=home_rate,
        away_wrc_per_pa=away_rate,
        home_recent_wrc_per_pa=home_recent_rate,
        away_recent_wrc_per_pa=away_recent_rate,
        home_starter_era=home_era,
        away_starter_era=away_era,
        home_starter_recent_era=home_recent_era,
        away_starter_recent_era=away_recent_era,
    )