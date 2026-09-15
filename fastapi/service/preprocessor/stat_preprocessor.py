import re
from typing import Any

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


def build_team_hitter_profile(hitters: list[dict], team_id: int) -> dict[str, Any]:
    """팀 타자단 평균 -> process_matchup_stats 가 요구하는 '팀 대표 타자 1명' 형태로 변환"""
    rows = [h for h in hitters if h["team_id"] == team_id]
    n = len(rows)
    avg_pa = round(sum(r["hitter_pa"] for r in rows) / n)
    avg_wrc = round(sum(r["hitter_wrc"] for r in rows) / n, 2)
    full_hists = [r["hitter_wrc_history"] for r in rows if len(r["hitter_wrc_history"]) == 10]
    avg_hist = [round(sum(h[i] for h in full_hists) / len(full_hists), 2) for i in range(10)] if full_hists else []
    return {"hitter_pa": avg_pa, "hitter_wrc": avg_wrc, "hitter_wrc_history": avg_hist}


def select_probable_starter(pitchers: list[dict], team_id: int) -> dict | None:
    """
    '선발예고' 소스가 별도로 없어서, 이닝(IP) > 100 인 투수 = 선발진으로 추정하고
    그 중 최근 ERA 가장 좋은 투수를 그 날의 선발로 가정한다.
    (선발예고 페이지가 생기면 이 함수만 교체하면 됨)
    """
    candidates = [p for p in pitchers if p["team_id"] == team_id and p["pitcher_ip"] > 100]
    if not candidates:
        candidates = [p for p in pitchers if p["team_id"] == team_id]
    if not candidates:
        return None
    return min(candidates, key=lambda p: p["pitcher_era"])


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
                                                   updated_at = NOW();
                 """

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
        """매일 - 선수 시즌 누적 스탯 최신화 (UPDATE)"""
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

    def save_batch_stats(self, records: list[tuple[str, dict[str, Any]]]):
        if self.dry_run:
            print("\n================ [DRY-RUN MODE] ================")
            for match_id, stats in records:
                params = self._build_params(match_id, stats)
                print(f"\n[Match ID: {match_id}]")
                print(f"Params: {params}")
            print("================================================\n")
            return

        try:
            with self._connect() as conn, conn.cursor() as cur:
                for match_id, stats in records:
                    cur.execute(self.UPSERT_SQL, self._build_params(match_id, stats))
            print(f"성공적으로 {len(records)}건의 경기 통계를 저장하였습니다.")
        except ImportError:
            print("psycopg2가 설치되어 있지 않습니다. `pip install psycopg2-binary` 필요.")
        except Exception as e:  # noqa: BLE001
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


def run_daily_update(dataset_dir: str, db_config: dict[str, Any], dry_run: bool = True,
                     target_date: str | None = None):
    parser = RosterHtmlParser()
    _teams, abbr_to_id, stadium_index = parser.parse_teams(f"{dataset_dir}/raw_crawl_01_team_info.html")
    pitchers = parser.parse_pitchers(f"{dataset_dir}/raw_crawl_02_pitcher_records.html", abbr_to_id)
    hitters = parser.parse_hitters(f"{dataset_dir}/raw_crawl_03_hitter_records.html", abbr_to_id)
    games = parser.parse_schedule(f"{dataset_dir}/raw_crawl_04_schedule_results.html", abbr_to_id, stadium_index)

    db_saver = DatabaseSaver(db_config, dry_run=dry_run)
    db_saver.save_daily_rosters(pitchers, hitters)

    if target_date:
        games = [g for g in games if g["match_date"] == target_date]

    preprocessor = StatPreprocessor()
    abbr_by_id = {v: k for k, v in abbr_to_id.items()}
    batch_records = []
    skipped = 0

    for g in games:
        home_pitcher = select_probable_starter(pitchers, g["home_team_id"])
        away_pitcher = select_probable_starter(pitchers, g["away_team_id"])
        if home_pitcher is None or away_pitcher is None:
            skipped += 1
            continue

        home_hitter = build_team_hitter_profile(hitters, g["home_team_id"])
        away_hitter = build_team_hitter_profile(hitters, g["away_team_id"])

        stats = preprocessor.process_matchup_stats(home_hitter, away_hitter, home_pitcher, away_pitcher)
        match_id = f"{g['match_date'].replace('-', '')}_{abbr_by_id[g['home_team_id']]}_{abbr_by_id[g['away_team_id']]}"
        batch_records.append((match_id, stats))

    db_saver.save_batch_stats(batch_records)
    print(f"매치업 계산 완료: {len(batch_records)}건 처리, {skipped}건 스킵(선발투수 미확인)")


if __name__ == "__main__":
    DB_CONFIG = {
        "host": "localhost",
        "port": 5432,
        "dbname": "baseball_db",
        "user": "postgres",
        "password": "your_password",
    }

    run_daily_update(
        dataset_dir="fastapi/dataset",
        db_config=DB_CONFIG,
        dry_run=True,
        target_date="2026-03-28",
    )