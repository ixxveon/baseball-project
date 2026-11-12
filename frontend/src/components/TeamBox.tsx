import React from 'react';
import { TEAM_LOGOS } from '../constants/teamLogos.ts';

interface TeamBoxProps {
    side: 'HOME' | 'AWAY';
    teamName: string;
    isFavorite: boolean;
}

export default function TeamBox({ side, teamName, isFavorite }: TeamBoxProps): React.JSX.Element {
    const logo = TEAM_LOGOS[teamName];

    return (
        <div className={`team-box ${isFavorite ? 'favorite-team' : ''}`}>
            <div className="home-away-label">{side}</div>
            <div className="team-logo">
                {logo ? (
                    <img src={logo} alt={`${teamName} 로고`} />
                ) : (
                    <span className="team-logo-fallback">{teamName}</span>
                )}
            </div>
            <div className="team-name">{teamName}</div>
        </div>
    );
}