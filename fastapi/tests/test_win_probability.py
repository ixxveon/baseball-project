from core.win_probability import estimate_win


def hitters(rate: float, n: int = 9) -> list[dict]:
    return [{"hitter_recent10_pa": 40, "hitter_recent10_wrc": 40 * rate, "hitter_pa": 500, "hitter_wrc": 500 * rate}
            for _ in range(n)]


def pitcher(era: float) -> dict:
    return {"pitcher_recent10_ip": 30, "pitcher_recent10_earned_runs": era * 30 / 9, "pitcher_era": era}


def test_equal_teams_are_50_50():
    result = estimate_win(hitters(0.21), hitters(0.21), pitcher(4.2), pitcher(4.2))
    assert result.home_win_prob == 50.0


def test_better_home_offense_raises_home_win_prob():
    result = estimate_win(hitters(0.25), hitters(0.18), pitcher(4.2), pitcher(4.2))
    assert result.home_win_prob > 50


def test_weak_away_starter_helps_home():
    strong = estimate_win(hitters(0.21), hitters(0.21), pitcher(4.2), pitcher(3.0))
    weak = estimate_win(hitters(0.21), hitters(0.21), pitcher(4.2), pitcher(6.0))
    assert weak.home_win_prob > strong.home_win_prob


def test_missing_recent_data_falls_back_to_season_stats():
    no_recent = [{"hitter_recent10_pa": None, "hitter_recent10_wrc": None, "hitter_pa": 500, "hitter_wrc": 105.0}]
    result = estimate_win(no_recent, hitters(0.21), {"pitcher_era": 4.2}, {"pitcher_era": 4.2})
    assert result.home_win_prob == 50.0


def test_empty_inputs_do_not_crash():
    result = estimate_win([], [], {}, {})
    assert result.home_win_prob == 50.0


def test_score_has_no_tie_and_matches_favorite():
    result = estimate_win(hitters(0.212), hitters(0.209), pitcher(4.2), pitcher(4.2))
    home, away = map(int, result.score_predict.split(":"))
    assert home != away
    assert (home > away) == (result.home_win_prob > 50)


def test_hot_recent_form_counts_more_than_season_average():
    # 시즌 성적은 같고 최근 10경기만 다른 두 팀: 최근이 좋은 쪽이 우세해야 한다
    def team(recent_rate: float) -> list[dict]:
        return [{"hitter_recent10_pa": 40, "hitter_recent10_wrc": 40 * recent_rate,
                 "hitter_pa": 500, "hitter_wrc": 500 * 0.21} for _ in range(9)]

    result = estimate_win(team(0.28), team(0.14), pitcher(4.2), pitcher(4.2))
    assert result.home_win_prob > 55
    assert 0.14 < result.away_wrc_per_pa < 0.21 < result.home_wrc_per_pa < 0.28