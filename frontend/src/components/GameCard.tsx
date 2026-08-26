import React from 'react';
import type { GameRecommendation } from '../types/recommendation';

interface GameCardProps {
    game: GameRecommendation; // 👈 GamePick을 GameRecommendation으로 변경
}

export default function GameCard({ game }: GameCardProps): React.JSX.Element {
    return (
        <div className="game-card">
            <span>{game.gameDate}</span>
            <span>{game.teamName} vs {game.opponentTeamName}</span>
        </div>
    );
}