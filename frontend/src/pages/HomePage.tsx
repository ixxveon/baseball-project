import React, { useState } from 'react';
import RecommendedGames from '../components/RecommendedGames';
import AiSummary from '../components/AiSummary';
import RecentSummary from '../components/RecentSummary';
import ReservationsLinks from '../components/ReservationsLinks';
import NoticeBoard from '../components/NoticeBoard';
import FavoriteTeamSelector from '../components/FavoriteTeamSelector.tsx';
import { DEFAULT_FAVORITE_TEAM } from '../constants/teams';
import type { TeamName } from '../constants/teams';
import { useTargetGame } from '../hooks/useTargetGame';

export default function HomePage(): React.JSX.Element {
    const [favoriteTeam, setFavoriteTeam] = useState<TeamName>(DEFAULT_FAVORITE_TEAM);
    const { favoriteTeamId } = useTargetGame(favoriteTeam);

    return (
        <div className="home-container">
            <div className="welcome-section">
                <div className="welcome-text">
                    <h1>안녕하세요, 민형님! 👋</h1>
                    <p>{favoriteTeam}의 승리를 위닝PICK이 함께 예측합니다!</p>
                </div>

                <div className="header-notice-wrapper">
                    <NoticeBoard />
                </div>

                <FavoriteTeamSelector value={favoriteTeam} onChange={setFavoriteTeam} />
            </div>

            <div className="dashboard-grid-main">
                <RecommendedGames favoriteTeam={favoriteTeam} />
                <AiSummary favoriteTeam={favoriteTeam} />
            </div>

            <div className="dashboard-grid-sub">
                <RecentSummary teamId={favoriteTeamId} />
                <ReservationsLinks />
            </div>
        </div>
    );
}