import React, { useState } from 'react';
import RecommendedGames from '../components/RecommendedGames';
import AiSummary from '../components/AiSummary';
import RecentSummary from '../components/RecentSummary';
import ReservationsLinks from '../components/ReservationsLinks';
import NoticeBoard from '../components/NoticeBoard';

export default function HomeScreen(): React.JSX.Element {
    const [favoriteTeam, setFavoriteTeam] = useState<string>("LG 트윈스");

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFavoriteTeam(e.target.value);
    };

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

                <div className="my-team-selector">
                    <span className="star-icon">★</span>
                    <span className="selector-label">내 응원팀</span>

                    <select
                        className="team-select-box"
                        value={favoriteTeam}
                        onChange={handleTeamChange}
                    >
                        <option value="LG 트윈스">LG 트윈스</option>
                        <option value="두산 베어스">두산 베어스</option>
                        <option value="기아 타이거즈">기아 타이거즈</option>
                        <option value="삼성 라이온즈">삼성 라이온즈</option>
                        <option value="롯데 자이언츠">롯데 자이언츠</option>
                        <option value="한화 이글스">한화 이글스</option>
                        <option value="SSG 랜더스">SSG 랜더스</option>
                        <option value="키움 히어로즈">키움 히어로즈</option>
                        <option value="NC 다이노스">NC 다이노스</option>
                        <option value="KT 위즈">KT 위즈</option>
                    </select>
                </div>
            </div>

            <div className="dashboard-grid-main">
                {/* 기존 <RecommendedGames />에서 응원팀 전달 */}
                <RecommendedGames favoriteTeam={favoriteTeam} />

                <AiSummary />
            </div>

            <div className="dashboard-grid-sub">
                <RecentSummary />
                <ReservationsLinks />
            </div>
        </div>
    );
}
