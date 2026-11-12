package kr.co.winningpick.domain.calendar.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CalendarRepository {

    private final JdbcTemplate jdbcTemplate;

    public CalendarRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List findUpcomingGamesWithPredictions(String teamName, String yearMonth) {
        //language=text
        String sql = "SELECT "
                + "  g.game_id AS \"gameId\", "
                + "  TO_CHAR(g.match_date, 'YYYY-MM-DD') AS \"matchDate\", "
                + "  g.match_time AS \"matchTime\", "
                + "  ht.name AS \"homeTeamName\", "
                + "  at.name AS \"awayTeamName\", "
                + "  COALESCE(p.recommendation_score, 50) AS \"recommendationScore\", "
                + "  COALESCE(p.home_win_prob, 50.0) AS \"homeWinProb\", "
                + "  COALESCE(p.weather_adjustment, 0) AS \"weatherAdjustment\", "
                + "  p.result_json AS \"resultJson\" "
                + "FROM games g "
                + "JOIN teams ht ON ht.team_id = g.home_team_id "
                + "JOIN teams at ON at.team_id = g.away_team_id "
                + "LEFT JOIN LATERAL ( "
                + "  SELECT recommendation_score, home_win_prob, weather_adjustment, result_json "
                + "  FROM ai_predictions "
                + "  WHERE game_id = g.game_id "
                + "  ORDER BY created_at DESC "
                + "  LIMIT 1 "
                + ") p ON true "
                + "WHERE TO_CHAR(g.match_date, 'YYYY-MM') = ? "
                + "  AND (ht.name LIKE ? OR at.name LIKE ?) "
                + "  AND g.status != 'CANCELED' "
                + "ORDER BY g.match_date, g.match_time";

        String searchTeam = "%" + teamName + "%";
        return jdbcTemplate.queryForList(sql, yearMonth, searchTeam, searchTeam);
    }
}