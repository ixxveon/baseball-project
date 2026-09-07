import math
from typing import Any


class StatPreprocessor:
    def calculate_recent_hitter_wrc(self, current_wrc: float, history: list[float]) -> float:
        if not history or len(history) < 10:
            return current_wrc
        return round(current_wrc - history[-1], 2)

    def calculate_recent_pitcher_ra_per_ip(
            self, current_era: float, current_ip: float, era_history: list[float], ip_history: list[float]
    ) -> float:
        if not era_history or not ip_history or len(era_history) < 10 or len(ip_history) < 10:
            return round(current_era / 9.0, 3)

        total_runs = sum((era * ip) / 9.0 for era, ip in zip(era_history[:10], ip_history[:10]))
        total_ip = sum(ip_history[:10])

        if total_ip == 0:
            return round(current_era / 9.0, 3)

        return round(total_runs / total_ip, 3)

    def calculate_pythagorean_win_rate(self, home_runs: float, away_runs: float) -> tuple[float, float]:
        exp = 1.83
        home_pow = math.pow(home_runs, exp)
        away_pow = math.pow(away_runs, exp)

        total = home_pow + away_pow
        if total == 0:
            return 0.50, 0.50

        home_win_rate = round(home_pow / total, 2)
        away_win_rate = round(1.0 - home_win_rate, 2)

        return home_win_rate, away_win_rate

    def process_matchup_stats(
            self,
            home_hitter: dict[str, Any],
            away_hitter: dict[str, Any],
            home_pitcher: dict[str, Any],
            away_pitcher: dict[str, Any],
    ) -> dict[str, Any]:
        home_wrc_last10 = self.calculate_recent_hitter_wrc(
            home_hitter["hitter_wrc"], home_hitter.get("hitter_wrc_history", [])
        )
        away_wrc_last10 = self.calculate_recent_hitter_wrc(
            away_hitter["hitter_wrc"], away_hitter.get("hitter_wrc_history", [])
        )

        home_ra_per_ip = self.calculate_recent_pitcher_ra_per_ip(
            home_pitcher["pitcher_era"],
            home_pitcher["pitcher_ip"],
            home_pitcher.get("pitcher_era_history", []),
            home_pitcher.get("pitcher_ip_history", []),
        )
        away_ra_per_ip = self.calculate_recent_pitcher_ra_per_ip(
            away_pitcher["pitcher_era"],
            away_pitcher["pitcher_ip"],
            away_pitcher.get("pitcher_era_history", []),
            away_pitcher.get("pitcher_ip_history", []),
        )

        home_win_rate, away_win_rate = self.calculate_pythagorean_win_rate(
            home_wrc_last10, away_wrc_last10
        )

        return {
            "homeTeam": {
                "hitterWrcLast10": home_wrc_last10,
                "pitcherRaPerIpLast10": home_ra_per_ip,
                "winRate": home_win_rate,
                "pa": home_hitter["hitter_pa"],
                "ip": home_pitcher["pitcher_ip"],
            },
            "awayTeam": {
                "hitterWrcLast10": away_wrc_last10,
                "pitcherRaPerIpLast10": away_ra_per_ip,
                "winRate": away_win_rate,
                "pa": away_hitter["hitter_pa"],
                "ip": away_pitcher["pitcher_ip"],
            },
        }