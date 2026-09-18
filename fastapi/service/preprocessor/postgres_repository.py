import os
from typing import Any

import psycopg2
import psycopg2.extras


class PostgresPredictionRepository:
    def __init__(self, dsn: str | None = None):
        self._dsn_override = dsn

    @staticmethod
    def _dsn_from_env() -> str:
        password = os.environ.get("PGPASSWORD")
        if not password:
            raise RuntimeError("필수 환경변수 PGPASSWORD가 설정되지 않았습니다.")
        return (
            f"host={os.environ.get('PGHOST', 'localhost')} "
            f"port={os.environ.get('PGPORT', '5432')} "
            f"dbname={os.environ.get('PGDATABASE', 'winningpick')} "
            f"user={os.environ.get('PGUSER', 'postgres')} "
            f"password={password}"
        )

    def _connect(self):
        dsn = self._dsn_override or self._dsn_from_env()
        return psycopg2.connect(dsn)

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
            home_hitters = self._fetch_team_hitters(cur, game["home_team_id"])
            away_hitters = self._fetch_team_hitters(cur, game["away_team_id"])

        return {
            "home_hitters": home_hitters,
            "away_hitters": away_hitters,
            "home_pitcher": home_pitcher,
            "away_pitcher": away_pitcher,
        }

    @staticmethod
    def _fetch_starter(cur, game_id: int, team_id: int) -> dict[str, Any]:
        cur.execute(
            """
            SELECT p.name, p.pitcher_ip, p.pitcher_era,
                   p.pitcher_recent10_ip, p.pitcher_recent10_earned_runs
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
            "name": row["name"],
            "pitcher_ip": float(row["pitcher_ip"]),
            "pitcher_era": float(row["pitcher_era"]),
            "pitcher_recent10_ip": float(row["pitcher_recent10_ip"]) if row["pitcher_recent10_ip"] is not None else None,
            "pitcher_recent10_earned_runs": (
                float(row["pitcher_recent10_earned_runs"]) if row["pitcher_recent10_earned_runs"] is not None else None
            ),
        }

    @staticmethod
    def _fetch_team_hitters(cur, team_id: int) -> list[dict[str, Any]]:
        cur.execute(
            """
            SELECT name, hitter_pa, hitter_wrc, hitter_recent10_pa, hitter_recent10_wrc
            FROM hitter_stats
            WHERE team_id = %s
            """,
            (team_id,),
        )
        rows = cur.fetchall()
        if not rows:
            raise ValueError(f"team_id={team_id} 의 타자 데이터가 없습니다.")

        return [
            {
                "name": r["name"],
                "hitter_pa": r["hitter_pa"],
                "hitter_wrc": float(r["hitter_wrc"]),
                "hitter_recent10_pa": r["hitter_recent10_pa"],
                "hitter_recent10_wrc": (
                    float(r["hitter_recent10_wrc"]) if r["hitter_recent10_wrc"] is not None else None
                ),
            }
            for r in rows
        ]

    def save_prediction(self, game_id: int, home_win_prob: float, summary_comment: str) -> None:
        with self._connect() as conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO ai_predictions (game_id, home_win_prob, summary_comment)
                VALUES (%s, %s, %s);
                """,
                (game_id, home_win_prob, summary_comment),
            )