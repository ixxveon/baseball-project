import React from 'react';
import type { UpcomingGame } from '../api/gamesApi';

interface GameCardProps {
    game: UpcomingGame;
    onClick?: (gameId: number) => void;
}

export default function GameCard({ game, onClick }: GameCardProps): React.JSX.Element {
    const content = (
        <>
            <span>{game.matchDate}</span>
            <span>{game.homeTeamName} vs {game.awayTeamName}</span>
            <span>
                추천점수: {game.recommendationScore !== null ? `${game.recommendationScore}점` : '계산중'}
            </span>
        </>
    );

    if (!onClick) {
        return <div className="game-card">{content}</div>;
    }

    return (
        <button
            type="button"
            className="game-card game-card-button"
            onClick={() => onClick(game.gameId)}
        >
            {content}
        </button>
    );
}