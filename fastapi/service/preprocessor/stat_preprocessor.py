import re
from datetime import date, datetime
from typing import Any
from zoneinfo import ZoneInfo

from bs4 import BeautifulSoup


class StatPreprocessor:

    def calculate_recent_hitter_wrc(self, current_wrc: float, history: list[float]) -> float:

        if not history or len(history) < 10:
            return round(current_wrc, 2)

        recent_10 = history[-10:]
        return round(current_wrc - recent_10[-1], 2)

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


class RosterHtmlParser:


    @staticmethod
    def _history_from_text(text: str) -> list[float]:
        text = text.strip()
        if text in ("", "-"):
            return []
        text = re.sub(r"\s*\(10경기 미만/신규등록\)\s*$", "", text)
        return [float(v.strip()) for v in text.split(",") if v.strip()]

    def parse_teams(self, html_path: str) -> tuple[list[dict], dict[str, int], dict[str, int]]:
        with open(html_path, encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        teams, abbr_to_id, stadium_index = [], {}, {}

        for tr in soup.select("table.tData tbody tr"):
            tds = tr.find_all("td")
            team_id = int(tds[0].get_text(strip=True))
            name = tds[1].get_text(strip=True)
            abbr = tds[2].get_text(strip=True)
            stadium_name = tds[3].get_text(strip=True)
            lat_str, lng_str = tds[4].get_text(strip=True).split(",")

            if stadium_name not in stadium_index:
                stadium_index[stadium_name] = len(stadium_index) + 1

            teams.append({
                "team_id": team_id, "name": name,
                "home_stadium_id": stadium_index[stadium_name],
                "latitude": float(lat_str), "longitude": float(lng_str),
            })
            abbr_to_id[abbr] = team_id

        return teams, abbr_to_id, stadium_index

    def parse_pitchers(self, html_path: str, abbr_to_id: dict[str, int]) -> list[dict]:
        with open(html_path, encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        pitchers = []
        for tr in soup.select("table.tData tbody tr"):
            tds = tr.find_all("td")
            abbr = tds[1].get_text(strip=True)
            link = tds[2].find("a")
            player_id = int(re.search(r"playerId=(\d+)", link["href"]).group(1))

            pitchers.append({
                "player_id": player_id,
                "name": link.get_text(strip=True),
                "team_id": abbr_to_id[abbr],
                "pitcher_ip": float(tds[3].get_text(strip=True).replace("이닝", "")),
                "pitcher_era": float(tds[4].get_text(strip=True)),
                "pitcher_fip": float(tds[5].get_text(strip=True)),
                "pitcher_era_history": self._history_from_text(tds[6].get_text()),
                "pitcher_fip_history": self._history_from_text(tds[7].get_text()),
                "pitcher_ip_history": self._history_from_text(tds[8].get_text()),
                "pitcher_status": tds[9].get_text(strip=True) == "Y",
            })
        return pitchers

    def parse_hitters(self, html_path: str, abbr_to_id: dict[str, int]) -> list[dict]:
        with open(html_path, encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        hitters = []
        for tr in soup.select("table.tData tbody tr"):
            tds = tr.find_all("td")
            abbr = tds[1].get_text(strip=True)
            link = tds[2].find("a")
            player_id = int(re.search(r"playerId=(\d+)", link["href"]).group(1))

            hitters.append({
                "player_id": player_id,
                "name": link.get_text(strip=True),
                "team_id": abbr_to_id[abbr],
                "hitter_position": tds[3].get_text(strip=True),
                "hitter_pa": int(tds[4].get_text(strip=True).replace("타석", "")),
                "hitter_wrc": float(tds[5].get_text(strip=True)),
                "hitter_wrc_history": self._history_from_text(tds[6].get_text()),
                "hitter_status": tds[7].get_text(strip=True) == "Y",
            })
        return hitters

    def parse_schedule(self, html_path: str, abbr_to_id: dict[str, int],
                       stadium_index: dict[str, int]) -> list[dict]:
        with open(html_path, encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        games = []
        for i, tr in enumerate(soup.select("table.tData tbody tr"), start=1):
            tds = tr.find_all("td")
            score_txt = tds[4].get_text(strip=True)
            if score_txt == "vs":
                home_score = away_score = None
            else:
                home_score, away_score = (int(x) for x in score_txt.split(":"))

            games.append({
                "game_id": i,
                "match_date": tds[0].get_text(strip=True),
                "match_time": tds[1].get_text(strip=True) + ":00",
                "stadium_id": stadium_index[tds[2].get_text(strip=True)],
                "home_team_id": abbr_to_id[tds[3].get_text(strip=True)],
                "away_team_id": abbr_to_id[tds[5].get_text(strip=True)],
                "status": "FINISHED" if tds[6].get_text(strip=True) == "경기종료" else "SCHEDULED",
                "is_weather_warning": tds[7].get_text(strip=True) == "우천특보",
                "home_score": home_score,
                "away_score": away_score,
            })
        return games


class DatabaseSaver:
    UPSERT_PITCHER_SQL = """
                         INSERT INTO pitcher_stats (
                             player_id, name, team_id, pitcher_ip, pitcher_era, pitcher_fip,
                             pitcher_era_history, pitcher_fip_history, pitcher_status
                         ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                             ON CONFLICT (player_id) DO UPDATE SET
                             pitcher_ip = EXCLUDED.pitcher_ip,
                                                            pitcher_era = EXCLUDED.pitcher_era,
                                                            pitcher_fip = EXCLUDED.pitcher_fip,
                                                            pitcher_era_history = EXCLUDED.pitcher_era_history,
                                                            pitcher_fip_history = EXCLUDED.pitcher_fip_history,
                                                            pitcher_status = EXCLUDED.pitcher_status; \
                         """

    UPSERT_HITTER_SQL = """
                        INSERT INTO hitter_stats (
                            player_id, name, team_id, hitter_pa, hitter_wrc,
                            hitter_wrc_history, hitter_position, hitter_status
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                            ON CONFLICT (player_id) DO UPDATE SET
                            hitter_pa = EXCLUDED.hitter_pa,
                                                           hitter_wrc = EXCLUDED.hitter_wrc,
                                                           hitter_wrc_history = EXCLUDED.hitter_wrc_history,
                                                           hitter_status = EXCLUDED.hitter_status; \
                        """

    def __init__(self, db_config: dict[str, Any], dry_run: bool = True):
        self.db_config = db_config
        self.dry_run = dry_run

    def _connect(self):
        import psycopg2
        return psycopg2.connect(**self.db_config)

    def save_daily_rosters(self, pitchers: list[dict], hitters: list[dict]):

        import json

        pitcher_params = [
            (p["player_id"], p["name"], p["team_id"], p["pitcher_ip"], p["pitcher_era"], p["pitcher_fip"],
             json.dumps(p["pitcher_era_history"]), json.dumps(p["pitcher_fip_history"]), p["pitcher_status"])
            for p in pitchers
        ]
        hitter_params = [
            (h["player_id"], h["name"], h["team_id"], h["hitter_pa"], h["hitter_wrc"],
             json.dumps(h["hitter_wrc_history"]), h["hitter_position"], h["hitter_status"])
            for h in hitters
        ]

        if self.dry_run:
            print(f"[DRY-RUN] pitcher_stats upsert {len(pitcher_params)}건, "
                  f"hitter_stats upsert {len(hitter_params)}건")
            return

        try:
            with self._connect() as conn, conn.cursor() as cur:
                cur.executemany(self.UPSERT_PITCHER_SQL, pitcher_params)
                cur.executemany(self.UPSERT_HITTER_SQL, hitter_params)
            print(f"선수 스탯 최신화 완료: 투수 {len(pitcher_params)}명, 타자 {len(hitter_params)}명")
        except ImportError:
            print("psycopg2가 설치되어 있지 않습니다. `pip install psycopg2-binary` 필요.")
            raise
        except Exception as e:
            print(f"DB 저장 중 오류 발생: {e}")
            raise

    UPDATE_GAME_RESULT_SQL = """
                             UPDATE games
                             SET status = %s, home_score = %s, away_score = %s, is_weather_warning = %s
                             WHERE game_id = %s; \
                             """

    def sync_game_results(self, games: list[dict], today: date):

        due = [g for g in games if g["match_date"] <= today.isoformat()]
        params = [
            (g["status"], g["home_score"], g["away_score"], g["is_weather_warning"], g["game_id"])
            for g in due
        ]

        if self.dry_run:
            print(f"[DRY-RUN] games 결과 갱신 대상 {len(params)}건 (오늘: {today.isoformat()})")
            return

        try:
            with self._connect() as conn, conn.cursor() as cur:
                cur.executemany(self.UPDATE_GAME_RESULT_SQL, params)
            print(f"경기 결과 갱신 완료: {len(params)}건 (오늘: {today.isoformat()})")
        except ImportError:
            print("psycopg2가 설치되어 있지 않습니다. `pip install psycopg2-binary` 필요.")
            raise
        except Exception as e:
            print(f"DB 저장 중 오류 발생: {e}")
            raise


def run_daily_update(dataset_dir: str, db_config: dict[str, Any], dry_run: bool = True):

    parser = RosterHtmlParser()
    _teams, abbr_to_id, stadium_index = parser.parse_teams(f"{dataset_dir}/raw_crawl_01_team_info.html")
    pitchers = parser.parse_pitchers(f"{dataset_dir}/raw_crawl_02_pitcher_records.html", abbr_to_id)
    hitters = parser.parse_hitters(f"{dataset_dir}/raw_crawl_03_hitter_records.html", abbr_to_id)
    games = parser.parse_schedule(f"{dataset_dir}/raw_crawl_04_schedule_results.html", abbr_to_id, stadium_index)

    db_saver = DatabaseSaver(db_config, dry_run=dry_run)
    db_saver.save_daily_rosters(pitchers, hitters)
    db_saver.sync_game_results(games, today=datetime.now(tz=ZoneInfo("Asia/Seoul")).date())


if __name__ == "__main__":

    import os

    DB_CONFIG = {
        "host": os.environ.get("PGHOST", "localhost"),
        "port": os.environ.get("PGPORT", "5432"),
        "dbname": os.environ.get("PGDATABASE", "winningpick"),
        "user": os.environ.get("PGUSER", "postgres"),
        "password": os.environ.get("PGPASSWORD", ""),
    }

    run_daily_update(
        dataset_dir="dataset",
        db_config=DB_CONFIG,
        dry_run=False,  # 실제 저장
    )