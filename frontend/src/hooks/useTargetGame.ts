import { useEffect, useState } from 'react';
import { fetchUpcomingGames, UpcomingGame } from '../api/gamesApi';

interface UseTargetGameResult {
    targetGame: UpcomingGame | null;
    favoriteTeamId: number | null;
    loading: boolean;
    isToday: boolean;
}

/**
 * 응원팀 기준으로 보여줄 경기 하나를 고른다.
 * 1. 오늘 + 응원팀 경기
 * 2. 응원팀이 나오는 가장 가까운 예정 경기
 * 3. (방어용) 목록 첫 번째 경기
 */
export function useTargetGame(favoriteTeam: string): UseTargetGameResult {
    const [games, setGames] = useState<UpcomingGame[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchUpcomingGames()
            .then((result) => {
                setGames(result);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading || games.length === 0) {
        return { targetGame: null, favoriteTeamId: null, loading, isToday: false };
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const favoriteGameToday = games.find(
        (game) =>
            game.matchDate === todayStr &&
            (game.homeTeamName === favoriteTeam || game.awayTeamName === favoriteTeam),
    );

    const nextFavoriteGame = games.find(
        (game) => game.homeTeamName === favoriteTeam || game.awayTeamName === favoriteTeam,
    );

    const targetGame = favoriteGameToday ?? nextFavoriteGame ?? games[0];

    const teamIdMatch = games.find(
        (game) => game.homeTeamName === favoriteTeam || game.awayTeamName === favoriteTeam,
    );
    const favoriteTeamId = teamIdMatch
        ? (teamIdMatch.homeTeamName === favoriteTeam ? teamIdMatch.homeTeamId : teamIdMatch.awayTeamId)
        : null;

    return { targetGame, favoriteTeamId, loading: false, isToday: targetGame.matchDate === todayStr };
}