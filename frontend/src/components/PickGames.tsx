import React from 'react';
import GameCard from './GameCard';
import { gamesData } from '../data/games';
import type { GamePick } from '../types';



export default function PickGames(): React.JSX.Element {
    return (
        <section className="pick-section">
            <div className="section-title">
                <h2>이번 달 직관 추천 경기</h2>

            </div>

            <div className="game-grid-container">
                {gamesData.map((game: GamePick) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </section>
    );
}