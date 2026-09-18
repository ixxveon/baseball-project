import React from 'react';
import type { UpcomingGame } from '../api/gamesApi';

interface GameCardProps {
    game: UpcomingGame;
    onClick?: (gameId: number) => void;
}

export default function GameCard({ game, onClick }: GameCardProps): React.JSX.Element {
    return (
        <div
            className="game-card"
            onClick={() => onClick?.(game.gameId)}
            style={onClick ? { cursor: 'pointer' } : undefined}
        >
            <span>{game.matchDate}</span>
            <span>{game.homeTeamName} vs {game.awayTeamName}</span>
            <span>
                추천점수: {game.recommendationScore !== null ? `${game.recommendationScore}점` : '계산중'}
            </span>
        </div>
    );
}