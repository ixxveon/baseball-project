from typing import Any


class StatPreprocessor:
    def calculate_recent_hitter_wrc(self, current_wrc: float, history: list[float]) -> float:
        """
        최신 wRC에서 10경기 전 wRC(리스트의 마지막 인덱스)를 차감하여 최근 10경기 wRC 산출
        """
        if not history or len(history) < 10:
            return current_wrc
        return round(current_wrc - history[-1], 2)

    def calculate_recent_pitcher_era(self, current_era: float, history: list[float]) -> float:
        """
        투수의 최근 10경기 평균 ERA 산출
        """
        if not history:
            return current_era
        return round(sum(history) / len(history), 2)

    def process_matchup_stats(
            self,
            home_hitter: dict[str, Any],
            away_hitter: dict[str, Any],
            home_pitcher: dict[str, Any],
            away_pitcher: dict[str, Any],
    ) -> dict[str, Any]:

        home_wrc_last10 = self.calculate_recent_hitter_wrc(
            float(home_hitter["hitter_wrc"]), home_hitter.get("hitter_wrc_history", [])
        )
        away_wrc_last10 = self.calculate_recent_hitter_wrc(
            float(away_hitter["hitter_wrc"]), away_hitter.get("hitter_wrc_history", [])
        )

        home_era_last10 = self.calculate_recent_pitcher_era(
            float(home_pitcher["pitcher_era"]), home_pitcher.get("pitcher_era_history", [])
        )
        away_era_last10 = self.calculate_recent_pitcher_era(
            float(away_pitcher["pitcher_era"]), away_pitcher.get("pitcher_era_history", [])
        )

        return {
            "homeTeam": {
                "hitterWrcLast10": home_wrc_last10,
                "pitcherEraLast10": home_era_last10,
                "pa": home_hitter["hitter_pa"],
                "ip": float(home_pitcher["pitcher_ip"]),
            },
            "awayTeam": {
                "hitterWrcLast10": away_wrc_last10,
                "pitcherEraLast10": away_era_last10,
                "pa": away_hitter["hitter_pa"],
                "ip": float(away_pitcher["pitcher_ip"]),
            },
        }