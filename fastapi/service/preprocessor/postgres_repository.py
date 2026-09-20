import os
from datetime import datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

import psycopg2
import psycopg2.extras

PREDICTION_WINDOW_DAYS = 14


class PredictionWindowError(ValueError):
    pass


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
                """
                SELECT g.home_team_id, g.away_team_id, g.match_date,
                       s.latitude, s.longitude
                FROM games g
                         JOIN stadiums s ON s.stadium_id = g.stadium_id
                WHERE g.game_id = %s
                """,
                (game_id,),
            )
            game = cur.fetchone()
            if game is None:
                raise ValueError(f"game_id={game_id} 를 찾을 수 없습니다.")

            self._validate_prediction_window(game["match_date"])

            home_pitcher = self._fetch_starter(cur, game_id, game["home_team_id"])
            away_pitcher = self._fetch_starter(cur, game_id, game["away_team_id"])
            home_hitters = self._fetch_team_hitters(cur, game["home_team_id"])
            away_hitters = self._fetch_team_hitters(cur, game["away_team_id"])
            head_to_head = self._fetch_head_to_head(
                cur, game["home_team_id"], game["away_team_id"], game["match_date"]
            )

        return {
            "match_date": game["match_date"],
            "stadium_latitude": float(game["latitude"]),
            "stadium_longitude": float(game["longitude"]),
            "home_hitters": home_hitters,
            "away_hitters": away_hitters,
            "home_pitcher": home_pitcher,
            "away_pitcher": away_pitcher,
            "head_to_head": head_to_head,
        }

    @staticmethod
    def _validate_prediction_window(match_date) -> None:
        today = datetime.now(tz=ZoneInfo("Asia/Seoul")).date()
        window_end = today + timedelta(days=PREDICTION_WINDOW_DAYS)
        if not (today <= match_date <= window_end):
            raise PredictionWindowError(
                f"분석 가능한 기간이 아닙니다 (오늘부터 {PREDICTION_WINDOW_DAYS}일 이내 경기만 분석 가능): "
                f"match_date={match_date}"
            )

    @staticmethod
    def _fetch_head_to_head(cur, home_team_id: int, away_team_id: int, season_match_date) -> dict[str, int]:
        cur.execute(
            """
            SELECT home_team_id, away_team_id, home_score, away_score
            FROM games
            WHERE status = 'FINISHED'
              AND home_score IS NOT NULL AND away_score IS NOT NULL
              AND EXTRACT(YEAR FROM match_date) = EXTRACT(YEAR FROM %s::date)
              AND ((home_team_id = %s AND away_team_id = %s)
                OR (home_team_id = %s AND away_team_id = %s))
            """,
            (season_match_date, home_team_id, away_team_id, away_team_id, home_team_id),
        )
        rows = cur.fetchall()

        home_wins = away_wins = 0
        for r in rows:
            if r["home_score"] == r["away_score"]:
                continue
            winner_id = r["home_team_id"] if r["home_score"] > r["away_score"] else r["away_team_id"]
            if winner_id == home_team_id:
                home_wins += 1
            else:
                away_wins += 1

        return {"homeWins": home_wins, "awayWins": away_wins}

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

    def save_prediction(
            self, game_id: int, home_win_prob: float, result_json: dict[str, Any], recommendation_score: int,
    ) -> None:
        import json

        with self._connect() as conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO ai_predictions (game_id, home_win_prob, result_json, recommendation_score)
                VALUES (%s, %s, %s, %s);
                """,
                (game_id, home_win_prob, json.dumps(result_json, ensure_ascii=False), recommendation_score),
            )

    def get_cached_prediction(self, game_id: int) -> dict[str, Any] | None:
        """오늘 이미 생성된 예측이 있으면 그대로 반환 (LLM 재호출 방지). 없거나 어제 이전 것이면 None."""
        with self._connect() as conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                SELECT result_json, recommendation_score, created_at
                FROM ai_predictions
                WHERE game_id = %s
                ORDER BY created_at DESC
                    LIMIT 1;
                """,
                (game_id,),
            )
            row = cur.fetchone()

        if row is None:
            return None

        today = datetime.now(tz=ZoneInfo("Asia/Seoul")).date()
        if row["created_at"].date() != today:
            return None

        return {"result_json": row["result_json"], "recommendation_score": row["recommendation_score"]}

    def get_recent_team_record(self, team_id: int, limit: int = 10) -> dict[str, Any]:
        """이 팀의 최근 N경기(완료된 경기만) 승/패, 평균 득점/실점."""
        with self._connect() as conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                SELECT home_team_id, away_team_id, home_score, away_score
                FROM games
                WHERE (home_team_id = %s OR away_team_id = %s)
                  AND status = 'FINISHED'
                ORDER BY match_date DESC, game_id DESC
                    LIMIT %s;
                """,
                (team_id, team_id, limit),
            )
            rows = cur.fetchall()

        wins = losses = 0
        scored_total = allowed_total = 0
        for r in rows:
            is_home = r["home_team_id"] == team_id
            scored = r["home_score"] if is_home else r["away_score"]
            allowed = r["away_score"] if is_home else r["home_score"]
            scored_total += scored
            allowed_total += allowed
            if scored > allowed:
                wins += 1
            elif scored < allowed:
                losses += 1

        games_count = len(rows)
        return {
            "wins": wins,
            "losses": losses,
            "games_count": games_count,
            "avg_scored": round(scored_total / games_count, 1) if games_count else 0.0,
            "avg_allowed": round(allowed_total / games_count, 1) if games_count else 0.0,
        }

    def get_upcoming_games(self) -> list[dict[str, Any]]:
        """오늘부터 PREDICTION_WINDOW_DAYS일 이내의 예정/완료 경기 목록.
        오늘 배치가 미리 계산해둔 recommendation_score가 있으면 같이 내려준다 (없으면 None)."""
        today = datetime.now(tz=ZoneInfo("Asia/Seoul")).date()
        window_end = today + timedelta(days=PREDICTION_WINDOW_DAYS)

        with self._connect() as conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                SELECT g.game_id, g.match_date, g.match_time,
                       g.home_team_id, ht.name AS home_team_name,
                       g.away_team_id, at.name AS away_team_name,
                       p.recommendation_score
                FROM games g
                         JOIN teams ht ON ht.team_id = g.home_team_id
                         JOIN teams at ON at.team_id = g.away_team_id
                    LEFT JOIN LATERAL (
                    SELECT recommendation_score
                    FROM ai_predictions
                    WHERE game_id = g.game_id AND created_at::date = %s
                    ORDER BY created_at DESC
                    LIMIT 1
                    ) p ON true
                WHERE g.match_date BETWEEN %s AND %s
                  AND g.status != 'CANCELED'
                ORDER BY g.match_date, g.match_time;
                """,
                (today, today, window_end),
            )
            rows = cur.fetchall()

        return [dict(r) for r in rows]