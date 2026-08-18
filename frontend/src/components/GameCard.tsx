import React from 'react';
import type { GameCardProps } from '../types';

export default function GameCard({ game }: GameCardProps): React.JSX.Element {
    return (
        <div className={`match-card ${game.selected ? 'is-selected' : ''}`}>
            <div className="match-card-header">
                <span className="match-date">{game.date}</span>
                <span className={`grade-badge-circle grade-${game.grade.toLowerCase()}`}>
                    {game.grade}
                </span>
            </div>

            <div className="match-card-body">
                <div className="teams-row">
                    <span className="home-team">{game.team1}</span>
                    <span className="vs-label">VS</span>
                    <span className="away-team">{game.team2}</span>
                </div>
                <div className="stadium-row">📍 {game.stadium}</div>
            </div>

            <div className="match-card-footer">
                <div className="score-info">
                    <strong className="score-text">{game.score}</strong>
                    <span className="tag-text">{game.tag}</span>
                </div>
                <div className="stars-text">{game.stars}</div>
            </div>
        </div>
    );
}