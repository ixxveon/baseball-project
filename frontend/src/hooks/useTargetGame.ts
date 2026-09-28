import { useQuery } from '@tanstack/react-query';
import { fetchUpcomingGames, UpcomingGame } from '../api/gamesApi';

interface UseTargetGameResult {
    targetGame: UpcomingGame | null;
    favoriteTeamId: number | null;
    loading: boolean;
    isToday: boolean;
    error: boolean;
}

export function useTargetGame(favoriteTeam: string): UseTargetGameResult {
    const { data: games, isLoading, isError } = useQuery({
        queryKey: ['upcomingGames'],
        queryFn: fetchUpcomingGames,
    });

    if (isLoading || isError || !games || games.length === 0) {
        return {
            targetGame: null,
            favoriteTeamId: null,
            loading: isLoading,
            isToday: false,
            error: isError,
        };
    }

    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

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

    return {
        targetGame,
        favoriteTeamId,
        loading: false,
        isToday: targetGame.matchDate === todayStr,
        error: false,
    };
}