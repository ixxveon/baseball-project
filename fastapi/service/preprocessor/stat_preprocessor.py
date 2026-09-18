import re
from datetime import date, datetime
from typing import Any
from zoneinfo import ZoneInfo

from bs4 import BeautifulSoup


class RosterHtmlParser:
    @staticmethod
    def _open(html_path: str) -> BeautifulSoup:
        with open(html_path, encoding="utf-8") as f:
            return BeautifulSoup(f.read(), "html.parser")

    @staticmethod
    def _player_id_from_link(td) -> int:
        link = td.find("a")
        return int(re.search(r"playerId=(\d+)", link["href"]).group(1))

    def parse_teams(self, html_path: str) -> tuple[list[dict], dict[str, int], dict[str, int]]:
        soup = self._open(html_path)
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

    def parse_pitcher_stat(self, html_path: str, abbr_to_id: dict[str, int]) -> list[dict]:
        soup = self._open(html_path)
        pitchers = []
        for tr in soup.select("table.tData tbody tr"):
            tds = tr.find_all("td")
            pitchers.append({
                "player_id": self._player_id_from_link(tds[2]),
                "name": tds[2].get_text(strip=True),
                "team_id": abbr_to_id[tds[1].get_text(strip=True)],
                "pitcher_ip": float(tds[3].get_text(strip=True).replace("이닝", "")),
                "pitcher_era": float(tds[4].get_text(strip=True)),
                "pitcher_fip": float(tds[5].get_text(strip=True)),
                "pitcher_status": tds[6].get_text(strip=True) == "Y",
            })
        return pitchers

    def parse_hitter_stat(self, html_path: str, abbr_to_id: dict[str, int]) -> list[dict]:
        soup = self._open(html_path)
        hitters = []
        for tr in soup.select("table.tData tbody tr"):
            tds = tr.find_all("td")
            hitters.append({
                "player_id": self._player_id_from_link(tds[2]),
                "name": tds[2].get_text(strip=True),
                "team_id": abbr_to_id[tds[1].get_text(strip=True)],
                "hitter_position": tds[3].get_text(strip=True),
                "hitter_pa": int(tds[4].get_text(strip=True).replace("타석", "")),
                "hitter_wrc": float(tds[5].get_text(strip=True)),
                "hitter_status": tds[6].get_text(strip=True) == "Y",
            })
        return hitters

    def parse_match_schedule(self, html_path: str, abbr_to_id: dict[str, int],
                             stadium_index: dict[str, int]) -> list[dict]:
        soup = self._open(html_path)
        games = []
        for tr in soup.select("table.tData tbody tr"):
            tds = tr.find_all("td")
            score_txt = tds[5].get_text(strip=True)
            if score_txt == "vs":
                home_score = away_score = None
            else:
                home_score, away_score = (int(x) for x in score_txt.split(":"))

            games.append({
                "game_id": int(tds[0].get_text(strip=True)),
                "match_date": tds[1].get_text(strip=True),
                "match_time": tds[2].get_text(strip=True) + ":00",
                "stadium_id": stadium_index[tds[3].get_text(strip=True)],
                "home_team_id": abbr_to_id[tds[4].get_text(strip=True)],
                "away_team_id": abbr_to_id[tds[6].get_text(strip=True)],
                "status": "FINISHED" if tds[7].get_text(strip=True) == "경기종료" else "SCHEDULED",
                "is_weather_warning": tds[8].get_text(strip=True) == "우천특보",
                "home_score": home_score,
                "away_score": away_score,
            })
        return games

    def parse_match_record(self, html_path: str) -> tuple[list[dict], list[dict]]:
        soup = self._open(html_path)
        hitter_records, pitcher_records = [], []
        for tr in soup.select("table.tData tbody tr"):
            tds = tr.find_all("td")
            match_date = tds[0].get_text(strip=True)
            game_id = int(tds[1].get_text(strip=True))
            kind = tds[3].get_text(strip=True)
            player_id = self._player_id_from_link(tds[4])

            if kind == "타자":
                hitter_records.append({
                    "player_id": player_id,
                    "game_id": game_id,
                    "match_date": match_date,
                    "hitter_pa": int(tds[5].get_text(strip=True)),
                    "game_wrc": float(tds[7].get_text(strip=True)),
                })
            else:
                pitcher_records.append({
                    "player_id": player_id,
                    "game_id": game_id,
                    "match_date": match_date,
                    "pitcher_ip": float(tds[6].get_text(strip=True)),
                    "earned_runs": float(tds[8].get_text(strip=True)),
                })
        return hitter_records, pitcher_records

    def parse_starting_pitchers(self, html_path: str) -> list[dict]:
        soup = self._open(html_path)
        rotation = []
        for tr in soup.select("table.tData tbody tr"):
            tds = tr.find_all("td")
            match_date = tds[0].get_text(strip=True)
            game_id = int(tds[1].get_text(strip=True))
            home_pid = self._player_id_from_link(tds[3])
            away_pid = self._player_id_from_link(tds[5])
            rotation.append({"player_id": home_pid, "game_id": game_id, "game_date": match_date})
            rotation.append({"player_id": away_pid, "game_id": game_id, "game_date": match_date})
        return rotation


class DatabaseSaver:
    INSERT_STADIUM_SQL = """
                         INSERT INTO stadiums (stadium_id, name, latitude, longitude)
                             OVERRIDING SYSTEM VALUE VALUES (%s, %s, %s, %s)
                             ON CONFLICT (stadium_id) DO NOTHING; \
                         """

    INSERT_TEAM_SQL = """
                      INSERT INTO teams (team_id, home_stadium_id, name, logo_url)
                          OVERRIDING SYSTEM VALUE VALUES (%s, %s, %s, NULL)
                          ON CONFLICT (team_id) DO NOTHING; \
                      """

    INSERT_GAME_SQL = """
                      INSERT INTO games (
                          game_id, home_team_id, away_team_id, stadium_id,
                          match_date, match_time, status, is_weather_warning, home_score, away_score
                      )
                          OVERRIDING SYSTEM VALUE VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                          ON CONFLICT (game_id) DO NOTHING; \
                      """

    INSERT_STARTER_ROTATION_SQL = """
                                  INSERT INTO starter_rotation (player_id, game_id, game_date)
                                      OVERRIDING SYSTEM VALUE VALUES (%s, %s, %s)
                                      ON CONFLICT DO NOTHING; \
                                  """

    UPSERT_PITCHER_SQL = """
                         INSERT INTO pitcher_stats (
                             player_id, name, team_id, pitcher_ip, pitcher_era, pitcher_fip, pitcher_status
                         ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                             ON CONFLICT (player_id) DO UPDATE SET
                             pitcher_ip = EXCLUDED.pitcher_ip,
                                                            pitcher_era = EXCLUDED.pitcher_era,
                                                            pitcher_fip = EXCLUDED.pitcher_fip,
                                                            pitcher_status = EXCLUDED.pitcher_status; \
                         """

    UPSERT_HITTER_SQL = """
                        INSERT INTO hitter_stats (
                            player_id, name, team_id, hitter_pa, hitter_wrc, hitter_position, hitter_status
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                            ON CONFLICT (player_id) DO UPDATE SET
                            hitter_pa = EXCLUDED.hitter_pa,
                                                           hitter_wrc = EXCLUDED.hitter_wrc,
                                                           hitter_status = EXCLUDED.hitter_status; \
                        """

    UPDATE_GAME_RESULT_SQL = """
                             UPDATE games
                             SET status = %s, home_score = %s, away_score = %s, is_weather_warning = %s
                             WHERE game_id = %s; \
                             """

    INSERT_HITTER_GAME_STATS_SQL = """
                                   INSERT INTO hitter_game_stats (player_id, game_id, hitter_pa, game_wrc)
                                   VALUES (%s, %s, %s, %s)
                                       ON CONFLICT (player_id, game_id) DO NOTHING; \
                                   """

    INSERT_PITCHER_GAME_STATS_SQL = """
                                    INSERT INTO pitcher_game_stats (player_id, game_id, pitcher_ip, earned_runs)
                                    VALUES (%s, %s, %s, %s)
                                        ON CONFLICT (player_id, game_id) DO NOTHING; \
                                    """

    UPDATE_HITTER_RECENT10_SQL = """
                                 WITH ranked AS (
                                     SELECT hgs.player_id, hgs.hitter_pa, hgs.game_wrc,
                                            ROW_NUMBER() OVER (
                                PARTITION BY hgs.player_id
                                ORDER BY g.match_date DESC, g.game_id DESC
                            ) AS rn
                                     FROM hitter_game_stats hgs
                                              JOIN games g ON g.game_id = hgs.game_id
                                 ),
                                      recent10 AS (
                                          SELECT player_id, SUM(hitter_pa) AS pa_sum, SUM(game_wrc) AS wrc_sum
                                          FROM ranked
                                          WHERE rn <= 10
                                          GROUP BY player_id
                                      )
                                 UPDATE hitter_stats hs
                                 SET hitter_recent10_pa = r.pa_sum,
                                     hitter_recent10_wrc = r.wrc_sum
                                     FROM recent10 r
                                 WHERE hs.player_id = r.player_id; \
                                 """

    UPDATE_PITCHER_RECENT10_SQL = """
                                  WITH ranked AS (
                                      SELECT pgs.player_id, pgs.pitcher_ip, pgs.earned_runs,
                                             ROW_NUMBER() OVER (
                                PARTITION BY pgs.player_id
                                ORDER BY g.match_date DESC, g.game_id DESC
                            ) AS rn
                                      FROM pitcher_game_stats pgs
                                               JOIN games g ON g.game_id = pgs.game_id
                                  ),
                                       recent10 AS (
                                           SELECT player_id, SUM(pitcher_ip) AS ip_sum, SUM(earned_runs) AS er_sum
                                           FROM ranked
                                           WHERE rn <= 10
                                           GROUP BY player_id
                                       )
                                  UPDATE pitcher_stats ps
                                  SET pitcher_recent10_ip = r.ip_sum,
                                      pitcher_recent10_earned_runs = r.er_sum
                                      FROM recent10 r
                                  WHERE ps.player_id = r.player_id; \
                                  """

    def __init__(self, db_config: dict[str, Any], dry_run: bool = True):
        self.db_config = db_config
        self.dry_run = dry_run

    def _connect(self):
        import psycopg2
        return psycopg2.connect(**self.db_config)

    def save_teams(self, teams: list[dict], stadium_index: dict[str, int]):
        stadium_id_to_name = {sid: name for name, sid in stadium_index.items()}
        stadium_id_to_coords = {}
        for t in teams:
            sid = t["home_stadium_id"]
            if sid not in stadium_id_to_coords:
                stadium_id_to_coords[sid] = (t["latitude"], t["longitude"])

        if self.dry_run:
            print(f"[DRY-RUN] stadiums insert {len(stadium_id_to_coords)}건, teams insert {len(teams)}건")
            return

        try:
            with self._connect() as conn, conn.cursor() as cur:
                for sid, (lat, lng) in stadium_id_to_coords.items():
                    cur.execute(self.INSERT_STADIUM_SQL, (sid, stadium_id_to_name[sid], lat, lng))
                for t in teams:
                    cur.execute(self.INSERT_TEAM_SQL, (t["team_id"], t["home_stadium_id"], t["name"]))
            print(f"팀/구장 저장 완료: 구장 {len(stadium_id_to_coords)}개, 구단 {len(teams)}개")
        except ImportError:
            print("psycopg2가 설치되어 있지 않습니다. `pip install psycopg2-binary` 필요.")
            raise
        except Exception as e:
            print(f"DB 저장 중 오류 발생: {e}")
            raise

    def save_games(self, games: list[dict]):
        params = [
            (g["game_id"], g["home_team_id"], g["away_team_id"], g["stadium_id"],
             g["match_date"], g["match_time"], g["status"], g["is_weather_warning"],
             g["home_score"], g["away_score"])
            for g in games
        ]

        if self.dry_run:
            print(f"[DRY-RUN] games insert {len(params)}건")
            return

        try:
            with self._connect() as conn, conn.cursor() as cur:
                cur.executemany(self.INSERT_GAME_SQL, params)
            print(f"경기 일정 저장 완료: {len(params)}건")
        except ImportError:
            print("psycopg2가 설치되어 있지 않습니다. `pip install psycopg2-binary` 필요.")
            raise
        except Exception as e:
            print(f"DB 저장 중 오류 발생: {e}")
            raise

    def save_starter_rotation(self, rotation: list[dict], today):
        due = [r for r in rotation if r["game_date"] == today.isoformat()]
        params = [(r["player_id"], r["game_id"], r["game_date"]) for r in due]

        if self.dry_run:
            print(f"[DRY-RUN] starter_rotation insert {len(params)}건 (오늘: {today.isoformat()})")
            return

        try:
            with self._connect() as conn, conn.cursor() as cur:
                cur.executemany(self.INSERT_STARTER_ROTATION_SQL, params)
            print(f"선발 로테이션 저장 완료: {len(params)}건 (오늘: {today.isoformat()})")
        except ImportError:
            print("psycopg2가 설치되어 있지 않습니다. `pip install psycopg2-binary` 필요.")
            raise
        except Exception as e:
            print(f"DB 저장 중 오류 발생: {e}")
            raise

    def save_daily_rosters(self, pitchers: list[dict], hitters: list[dict]):
        pitcher_params = [
            (p["player_id"], p["name"], p["team_id"], p["pitcher_ip"], p["pitcher_era"],
             p["pitcher_fip"], p["pitcher_status"])
            for p in pitchers
        ]
        hitter_params = [
            (h["player_id"], h["name"], h["team_id"], h["hitter_pa"], h["hitter_wrc"],
             h["hitter_position"], h["hitter_status"])
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

    def sync_game_results(self, games: list[dict], today):
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

    def save_match_records(self, hitter_records: list[dict], pitcher_records: list[dict], today):
        due_h = [r for r in hitter_records if r["match_date"] <= today.isoformat()]
        due_p = [r for r in pitcher_records if r["match_date"] <= today.isoformat()]
        h_params = [(r["player_id"], r["game_id"], r["hitter_pa"], r["game_wrc"]) for r in due_h]
        p_params = [(r["player_id"], r["game_id"], r["pitcher_ip"], r["earned_runs"]) for r in due_p]

        if self.dry_run:
            print(f"[DRY-RUN] hitter_game_stats insert {len(h_params)}건, "
                  f"pitcher_game_stats insert {len(p_params)}건")
            return

        try:
            with self._connect() as conn, conn.cursor() as cur:
                cur.executemany(self.INSERT_HITTER_GAME_STATS_SQL, h_params)
                cur.executemany(self.INSERT_PITCHER_GAME_STATS_SQL, p_params)
            print(f"경기별 개인기록 저장 완료: 타자 {len(h_params)}건, 투수 {len(p_params)}건")
        except ImportError:
            print("psycopg2가 설치되어 있지 않습니다. `pip install psycopg2-binary` 필요.")
            raise
        except Exception as e:
            print(f"DB 저장 중 오류 발생: {e}")
            raise

    def update_recent10_stats(self):
        if self.dry_run:
            print("[DRY-RUN] recent10 집계 UPDATE 스킵")
            return

        try:
            with self._connect() as conn, conn.cursor() as cur:
                cur.execute(self.UPDATE_HITTER_RECENT10_SQL)
                cur.execute(self.UPDATE_PITCHER_RECENT10_SQL)
            print("최근10경기 집계값(recent10_*) 갱신 완료")
        except ImportError:
            print("psycopg2가 설치되어 있지 않습니다. `pip install psycopg2-binary` 필요.")
            raise
        except Exception as e:
            print(f"DB 저장 중 오류 발생: {e}")
            raise


def run_initial_load(dataset_dir: str, db_config: dict[str, Any], dry_run: bool = True):
    """
    시즌 시작 전 1회 실행 - team_info/match_schedule 크롤링 결과를 그대로 파싱해서
    teams/stadiums/games 를 채운다. 선발 로테이션은 매일 새로 발표되는 정보라
    run_daily_update 쪽에서 처리한다.
    """
    parser = RosterHtmlParser()
    teams, abbr_to_id, stadium_index = parser.parse_teams(f"{dataset_dir}/raw_crawl_01_team_info.html")
    games = parser.parse_match_schedule(f"{dataset_dir}/raw_crawl_04_match_schedule.html", abbr_to_id, stadium_index)

    db_saver = DatabaseSaver(db_config, dry_run=dry_run)
    db_saver.save_teams(teams, stadium_index)
    db_saver.save_games(games)


def run_daily_update(dataset_dir: str, db_config: dict[str, Any], dry_run: bool = True, today: date | None = None):
    parser = RosterHtmlParser()
    _teams, abbr_to_id, stadium_index = parser.parse_teams(f"{dataset_dir}/raw_crawl_01_team_info.html")
    pitchers = parser.parse_pitcher_stat(f"{dataset_dir}/raw_crawl_02_pitcher_stat.html", abbr_to_id)
    hitters = parser.parse_hitter_stat(f"{dataset_dir}/raw_crawl_03_hitter_stat.html", abbr_to_id)
    games = parser.parse_match_schedule(f"{dataset_dir}/raw_crawl_04_match_schedule.html", abbr_to_id, stadium_index)
    hitter_records, pitcher_records = parser.parse_match_record(f"{dataset_dir}/raw_crawl_05_match_record.html")
    rotation = parser.parse_starting_pitchers(f"{dataset_dir}/raw_crawl_06_starting_pitchers.html")

    if today is None:
        today = datetime.now(tz=ZoneInfo("Asia/Seoul")).date()

    db_saver = DatabaseSaver(db_config, dry_run=dry_run)
    db_saver.save_daily_rosters(pitchers, hitters)
    db_saver.sync_game_results(games, today)
    db_saver.save_match_records(hitter_records, pitcher_records, today)
    db_saver.save_starter_rotation(rotation, today)
    db_saver.update_recent10_stats()


if __name__ == "__main__":
    import os

    def _required_env(name: str) -> str:
        value = os.environ.get(name)
        if not value:
            raise RuntimeError(f"필수 환경변수 {name}가 설정되지 않았습니다.")
        return value

    DB_CONFIG = {
        "host": os.environ.get("PGHOST", "localhost"),
        "port": os.environ.get("PGPORT", "5432"),
        "dbname": os.environ.get("PGDATABASE", "winningpick"),
        "user": os.environ.get("PGUSER", "postgres"),
        "password": _required_env("PGPASSWORD"),
    }

    run_initial_load(
        dataset_dir="dataset",
        db_config=DB_CONFIG,
        dry_run=False,
    )
    run_daily_update(
        dataset_dir="dataset",
        db_config=DB_CONFIG,
        dry_run=False,
    )