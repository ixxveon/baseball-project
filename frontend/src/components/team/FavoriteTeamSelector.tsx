import React from 'react';
import { KBO_TEAMS } from '../../constants/teams';
import type { TeamName } from '../../constants/teams';

interface FavoriteTeamSelectorProps {
    value: TeamName;
    onChange: (team: TeamName) => void;
}

export default function FavoriteTeamSelector({ value, onChange }: FavoriteTeamSelectorProps): React.JSX.Element {
    return (
        <div className="my-team-selector">
            <span className="star-icon">★</span>
            <span className="selector-label">내 응원팀</span>

            <select
                className="team-select-box"
                value={value}
                onChange={(e) => onChange(e.target.value as TeamName)}
            >
                {KBO_TEAMS.map((team) => (
                    <option key={team.id} value={team.name}>{team.name}</option>
                ))}
            </select>
        </div>
    );
}