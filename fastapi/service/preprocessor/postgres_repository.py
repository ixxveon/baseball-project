
import os
from typing import Any

import psycopg2
import psycopg2.extras


class PostgresPredictionRepository:
    def __init__(self, dsn: str | None = None):
        self.dsn = dsn or self._dsn_from_env()

    @staticmethod
    def _dsn_from_env() -> str:
        return (
            f"host={os.environ.get('PGHOST', 'localhost')} "
            f"port={os.environ.get('PGPORT', '5432')} "
            f"dbname={os.environ.get('PGDATABASE', 'winningpick')} "
            f"user={os.environ.get('PGUSER', 'postgres')} "
            f"password={os.environ.get('PGPASSWORD', '')}"
        )

    def _connect(self):
        return psycopg2.connect(self.dsn)

    def get_matchup_stats(self, game_id: int) -> dict[str, Any]:
        with self._connect() as conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                'SELECT home_team_id, away_team_id FROM games WHERE game_id = %s',
                (game_id,),
            )
            game = cur.fetchone()
            if game is None:
                raise ValueError(f"game_id={game_id} 를 찾을 수 없습니다.")

            home_pitcher = self._fetch_starter(cur, game_id, game["home_team_id"])
            away_pitcher = self._fetch_starter(cur, game_id, game["away_team_id"])
            home_hitter = self._fetch_team_hitter_profile(cur, game["home_team_id"])
            away_hitter = self._fetch_team_hitter_profile(cur, game["away_team_id"])

        return {
            "home_hitter": home_hitter,
            "away_hitter": away_hitter,
            "home_pitcher": home_pitcher,
            "away_pitcher": away_pitcher,
        }

    @staticmethod
    def _fetch_starter(cur, game_id: int, team_id: int) -> dict[str, Any]:
        cur.execute(
            """
            SELECT p.pitcher_ip, p.pitcher_era, p.pitcher_era_history
            FROM starter_rotation sr
                     JOIN pitcher_stats p ON p.player_id = sr.player_id
            WHERE sr.game_id = %s AND p.team_id = %s
            """,
            (game_id, team_id),
        )
        row = cur.fetchone()
        if row is None:
            raise ValueError(f"game_id={game_id}, team_id={team_id} 의 선발투수를 찾을 수 없습니다.")

        return {
            "pitcher_ip": float(row["pitcher_ip"]),
            "pitcher_era": float(row["pitcher_era"]),
            "pitcher_era_history": row["pitcher_era_history"] or [],
            # pitcher_ip_history 는 현재 DB 스키마에 컬럼이 없음 (기존에 확인된 갭).
            # 값이 없으면 StatPreprocessor가 자동으로 fallback(current_era/9.0)을 탄다.
            "pitcher_ip_history": [],
        }

    @staticmethod
    def _fetch_team_hitter_profile(cur, team_id: int) -> dict[str, Any]:
        cur.execute(
            'SELECT hitter_pa, hitter_wrc, hitter_wrc_history FROM hitter_stats WHERE team_id = %s',
            (team_id,),
        )
        rows = cur.fetchall()
        if not rows:
            raise ValueError(f"team_id={team_id} 의 타자 데이터가 없습니다.")

        n = len(rows)
        avg_pa = round(sum(r["hitter_pa"] for r in rows) / n)
        avg_wrc = round(sum(float(r["hitter_wrc"]) for r in rows) / n, 2)

        full_hists = [r["hitter_wrc_history"] for r in rows
                      if r["hitter_wrc_history"] and len(r["hitter_wrc_history"]) == 10]
        avg_hist = ([round(sum(h[i] for h in full_hists) / len(full_hists), 2) for i in range(10)]
                    if full_hists else [])

        return {"hitter_pa": avg_pa, "hitter_wrc": avg_wrc, "hitter_wrc_history": avg_hist}