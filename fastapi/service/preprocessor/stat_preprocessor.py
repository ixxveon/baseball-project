import re
from datetime import date, datetime
from typing import Any
from zoneinfo import ZoneInfo

from bs4 import BeautifulSoup


class StatPreprocessor:
    """전처리 계산 로직 (기존 로직 그대로 유지)"""

    def calculate_recent_hitter_wrc(self, current_wrc: float, history: list[float]) -> float:
        # history 는 시즌 누적 wRC의 과거 시점 스냅샷 (index 0 = 1경기 전, index -1 = 10경기 전).
        # 따라서 "최근 10경기 생산력"은 평균이 아니라 현재값과 10경기 전 값의 차이(증가분)다.
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
    """
    raw_crawl_01_team_info.html / 02_pitcher_records.html / 03_hitter_records.html /
    04_schedule_results.html (선수 순위표 + 일정표) 를 파싱하는 '원시데이터 추출' 단계.

    기존 MatchHtmlParser 는 '경기 1건짜리 페이지(#match-info, .home-wrc 등)'를 가정하고
    있었는데, 실제 크롤링 대상은 '선수 전체 순위표'라서 셀렉터가 전혀 맞지 않았고
    hitter_wrc_history/pitcher_era_history/pitcher_ip_history 는 파싱 코드 없이
    하드코딩된 고정값이 저장되는 문제가 있었습니다. 이 클래스가 그 부분을 대체합니다.
    """

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
        """매일 - 선수 시즌 누적 원자료(현재값+히스토리) 최신화 (UPSERT). 파생값은 저장하지 않는다."""
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
        except Exception as e:  # noqa: BLE001 - DB 저장 전체 실패를 유저에게 알리기 위한 최종 방어선
            print(f"DB 저장 중 오류 발생: {e}")

    UPDATE_GAME_RESULT_SQL = """
                             UPDATE games
                             SET status = %s, home_score = %s, away_score = %s, is_weather_warning = %s
                             WHERE game_id = %s; \
                             """

    def sync_game_results(self, games: list[dict], today: date):
        """
        오늘(today) 이하 날짜의 경기만 크롤링된 상태/스코어로 갱신한다.
        오늘보다 미래인 경기는 아직 열리지 않았으므로 건드리지 않는다.
        (games 행 자체는 시즌 시작 전 일정표로 이미 존재한다고 가정 - INSERT 아님, UPDATE만)
        """
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
        except Exception as e:  # noqa: BLE001
            print(f"DB 저장 중 오류 발생: {e}")


def run_daily_update(dataset_dir: str, db_config: dict[str, Any], dry_run: bool = True):
    """
    매일 실행되는 배치.
      1) raw_crawl_01~03 (선수 순위표) 를 파싱해서 pitcher_stats/hitter_stats 원자료만 최신화한다.
      2) raw_crawl_04 (일정/결과) 를 파싱해서, 오늘 날짜 이하로 열린 경기의 상태/스코어를 games에 반영한다.
         (games 행 자체는 시즌 시작 전 일정표로 이미 채워져 있다고 가정 - UPDATE만 수행)

    매치업 계산(hitterWrcLast10, pitcherRaPerIpLast10, winRate 등)은 여기서 하지 않는다.
    그 값들은 이미 저장된 히스토리로부터 언제든 다시 계산 가능한 파생값이라, 저장해두면
    원본과 파생값 두 군데가 따로 놀며 불일치가 생길 여지만 만든다. 실제 매치업 계산은
    요청이 들어온 시점에 PredictionService.prepare_matchup_prompt() 가 그때그때 수행한다.
    """
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