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
import { useMyInfo } from '../hooks/useMyInfo';

export default function HomePage(): React.JSX.Element {
    const [favoriteTeam, setFavoriteTeam] = useState<TeamName>(DEFAULT_FAVORITE_TEAM);
    const { favoriteTeamId } = useTargetGame(favoriteTeam);
    const myInfo = useMyInfo();
    const greeting = myInfo ? `${myInfo.nickname}님, 오늘 경기 확인해 보세요` : '오늘 경기 확인해 보세요';

    return (
        <div className="home-container">
            <div className="welcome-section">
                <div className="welcome-text">
                    <h1>{greeting}</h1>
                    <p>{favoriteTeam} 경기를 위닝PICK이 분석해 드려요</p>
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