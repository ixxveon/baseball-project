from typing import Any

from bs4 import BeautifulSoup


class StatPreprocessor:
    def calculate_recent_hitter_wrc(self, current_wrc: float, history: list[float]) -> float:
        if not history or len(history) < 10:
            return round(current_wrc, 2)

        recent_10 = history[-10:]
        return round(sum(recent_10) / len(recent_10), 2)

    def calculate_recent_pitcher_ra_per_ip(
            self, current_era: float, current_ip: float, era_history: list[float], ip_history: list[float]
    ) -> float:
        if not era_history or not ip_history or len(era_history) < 10 or len(ip_history) < 10:
            return round(current_era / 9.0, 3) if current_era else 0.0

        recent_era = era_history[-10:]
        recent_ip = ip_history[-10:]

        total_runs = sum((era * ip) / 9.0 for era, ip in zip(recent_era, recent_ip))
        total_ip = sum(recent_ip)

        if total_ip == 0:
            return round(current_era / 9.0, 3)

        return round(total_runs / total_ip, 3)

    def process_matchup_stats(
            self,
            home_hitter: dict[str, Any],
            away_hitter: dict[str, Any],
            home_pitcher: dict[str, Any],
            away_pitcher: dict[str, Any],
    ) -> dict[str, Any]:
        home_wrc_last10 = self.calculate_recent_hitter_wrc(
            home_hitter.get("hitter_wrc", 0.0), home_hitter.get("hitter_wrc_history", [])
        )
        away_wrc_last10 = self.calculate_recent_hitter_wrc(
            away_hitter.get("hitter_wrc", 0.0), away_hitter.get("hitter_wrc_history", [])
        )

        home_ra_per_ip = self.calculate_recent_pitcher_ra_per_ip(
            home_pitcher.get("pitcher_era", 0.0),
            home_pitcher.get("pitcher_ip", 0.0),
            home_pitcher.get("pitcher_era_history", []),
            home_pitcher.get("pitcher_ip_history", []),
        )
        away_ra_per_ip = self.calculate_recent_pitcher_ra_per_ip(
            away_pitcher.get("pitcher_era", 0.0),
            away_pitcher.get("pitcher_ip", 0.0),
            away_pitcher.get("pitcher_era_history", []),
            away_pitcher.get("pitcher_ip_history", []),
        )

        return {
            "homeTeam": {
                "hitterWrcLast10": home_wrc_last10,
                "pitcherRaPerIpLast10": home_ra_per_ip,
                "pa": home_hitter.get("hitter_pa", 0),
                "ip": home_pitcher.get("pitcher_ip", 0.0),
            },
            "awayTeam": {
                "hitterWrcLast10": away_wrc_last10,
                "pitcherRaPerIpLast10": away_ra_per_ip,
                "pa": away_hitter.get("hitter_pa", 0),
                "ip": away_pitcher.get("pitcher_ip", 0.0),
            },
        }

class MatchHtmlParser:
    @staticmethod
    def _safe_float(element, default: float = 0.0) -> float:
        if element is None:
            return default
        try:
            return float(element.text.strip())
        except ValueError:
            return default

    @staticmethod
    def _safe_int(element, default: int = 0) -> int:
        if element is None:
            return default
        try:
            return int(element.text.strip())
        except ValueError:
            return default

    def parse_match_data(self, html_content: str) -> dict[str, Any]:
        soup = BeautifulSoup(html_content, "html.parser")

        match_info_tag = soup.find("div", {"id": "match-info"})
        match_id = match_info_tag["data-id"] if match_info_tag and "data-id" in match_info_tag.attrs else "UNKNOWN_MATCH"

        parsed_data = {
            "match_id": match_id,
            "home_hitter": {
                "hitter_wrc": self._safe_float(soup.select_one(".home-wrc"), 100.0),
                "hitter_pa": self._safe_int(soup.select_one(".home-pa"), 0),
                "hitter_wrc_history": [100.0, 102.0, 110.0, 95.0, 105.0, 115.0, 120.0, 98.0, 104.0, 108.0],
            },
            "away_hitter": {
                "hitter_wrc": self._safe_float(soup.select_one(".away-wrc"), 100.0),
                "hitter_pa": self._safe_int(soup.select_one(".away-pa"), 0),
                "hitter_wrc_history": [90.0, 92.0, 88.0, 95.0, 100.0, 93.0, 97.0, 91.0, 89.0, 94.0],
            },
            "home_pitcher": {
                "pitcher_era": self._safe_float(soup.select_one(".home-era"), 4.00),
                "pitcher_ip": self._safe_float(soup.select_one(".home-ip"), 0.0),
                "pitcher_era_history": [3.0, 4.0, 2.5, 3.5, 4.5, 3.0, 2.0, 3.5, 4.0, 3.0],
                "pitcher_ip_history": [6.0, 5.0, 7.0, 6.0, 5.0, 6.0, 7.0, 6.0, 5.0, 6.0],
            },
            "away_pitcher": {
                "pitcher_era": self._safe_float(soup.select_one(".away-era"), 4.00),
                "pitcher_ip": self._safe_float(soup.select_one(".away-ip"), 0.0),
                "pitcher_era_history": [4.0, 5.0, 3.5, 4.5, 5.0, 4.0, 3.0, 4.5, 5.0, 4.0],
                "pitcher_ip_history": [5.0, 5.0, 6.0, 5.0, 4.0, 5.0, 6.0, 5.0, 4.0, 5.0],
            },
        }
        return parsed_data

class DatabaseSaver:
    UPSERT_SQL = """
                 INSERT INTO processed_match_stats (
                     match_id,
                     home_hitter_wrc_last10, home_pitcher_ra_per_ip_last10, home_pa, home_ip,
                     away_hitter_wrc_last10, away_pitcher_ra_per_ip_last10, away_pa, away_ip,
                     updated_at
                 ) VALUES (
                              %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW()
                          )
                     ON CONFLICT (match_id) DO UPDATE SET
                     home_hitter_wrc_last10 = EXCLUDED.home_hitter_wrc_last10,
                                                   home_pitcher_ra_per_ip_last10 = EXCLUDED.home_pitcher_ra_per_ip_last10,
                                                   home_pa = EXCLUDED.home_pa,
                                                   home_ip = EXCLUDED.home_ip,
                                                   away_hitter_wrc_last10 = EXCLUDED.away_hitter_wrc_last10,
                                                   away_pitcher_ra_per_ip_last10 = EXCLUDED.away_pitcher_ra_per_ip_last10,
                                                   away_pa = EXCLUDED.away_pa,
                                                   away_ip = EXCLUDED.away_ip,
                                                   updated_at = NOW(); \
                 """

    def __init__(self, db_config: dict[str, Any], dry_run: bool = True):
        self.db_config = db_config
        self.dry_run = dry_run

    def save_batch_stats(self, records: list[tuple[str, dict[str, Any]]]):
        if self.dry_run:
            print("\n================ [DRY-RUN MODE] ================")
            for match_id, stats in records:
                params = self._build_params(match_id, stats)
                print(f"\n[Match ID: {match_id}]")
                print(f"SQL: {self.UPSERT_SQL.strip()}")
                print(f"Params: {params}")
            print("================================================\n")
            return

        try:
            import psycopg2
            with psycopg2.connect(**self.db_config) as conn:
                with conn.cursor() as cur:
                    for match_id, stats in records:
                        params = self._build_params(match_id, stats)
                        cur.execute(self.UPSERT_SQL, params)
                conn.commit()
            print(f"성공적으로 {len(records)}건의 경기 통계를 저장하였습니다.")
        except psycopg2.Error as e:
            print(f"DB 저장 중 오류 발생: {e}")

    def _build_params(self, match_id: str, stats: dict[str, Any]) -> tuple:
        return (
            match_id,
            stats["homeTeam"]["hitterWrcLast10"],
            stats["homeTeam"]["pitcherRaPerIpLast10"],
            stats["homeTeam"]["pa"],
            stats["homeTeam"]["ip"],
            stats["awayTeam"]["hitterWrcLast10"],
            stats["awayTeam"]["pitcherRaPerIpLast10"],
            stats["awayTeam"]["pa"],
            stats["awayTeam"]["ip"],
        )

def run_pipeline(raw_html_list: list[str], db_config: dict[str, Any], dry_run: bool = True):
    preprocessor = StatPreprocessor()
    parser = MatchHtmlParser()
    db_saver = DatabaseSaver(db_config, dry_run=dry_run)

    batch_records = []

    for idx, html in enumerate(raw_html_list, start=1):
        raw_data = parser.parse_match_data(html)

        processed_stats = preprocessor.process_matchup_stats(
            home_hitter=raw_data["home_hitter"],
            away_hitter=raw_data["away_hitter"],
            home_pitcher=raw_data["home_pitcher"],
            away_pitcher=raw_data["away_pitcher"],
        )

        batch_records.append((raw_data["match_id"], processed_stats))

    db_saver.save_batch_stats(batch_records)

if __name__ == "__main__":
    sample_html_files = [
        '<div id="match-info" data-id="20260913_LG_NC"><span class="home-wrc">108.5</span><span class="home-pa">420</span><span class="away-wrc">98.2</span><span class="away-pa">400</span></div>',
        '<div id="match-info" data-id="20260913_SSG_KT"><span class="home-wrc">102.1</span><span class="home-pa">390</span><span class="away-wrc">105.0</span><span class="away-pa">410</span></div>',
    ]

    DB_CONFIG = {
        "host": "localhost",
        "port": 5432,
        "dbname": "baseball_db",
        "user": "postgres",
        "password": "your_password",
    }

    run_pipeline(sample_html_files, DB_CONFIG, dry_run=True)