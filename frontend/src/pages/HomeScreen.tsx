import React, { useState } from 'react';
import RecommendedGames from '../components/RecommendedGames';
import AiSummary from '../components/AiSummary';
import RecentSummary from '../components/RecentSummary';
import ReservationsLinks from '../components/ReservationsLinks';
import NoticeBoard from '../components/NoticeBoard';

export default function HomeScreen(): React.JSX.Element {
    const [favoriteTeam, setFavoriteTeam] = useState<string>("LG");

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFavoriteTeam(e.target.value);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-main">
                {/* 상단 환영 섹션 & 응원팀 선택 토글 */}
                <div className="welcome-section">
                    <div className="welcome-text">
                        <h1>안녕하세요, 민형님! 👋</h1>
                        <p>{favoriteTeam} 트윈스의 승리를 위닝PICK이 함께 예측합니다!</p>
                    </div>

                    <div className="my-team-selector">
                        <span className="star-icon">★</span>
                        <span>내 응원팀</span>
                        <select value={favoriteTeam} onChange={handleTeamChange}>
                            <option value="LG">LG 트윈스</option>
                            <option value="두산">두산 베어스</option>
                            <option value="삼성">삼성 라이온즈</option>
                        </select>
                    </div>
                </div>

                {/* 메인 2열 그리드 섹션 (히어로 추천 & AI 요약) */}
                <div className="hero-section-grid" style={{ marginBottom: '24px' }}>
                    <RecommendedGames />
                    <AiSummary />
                </div>

                {/* 하단 대시보드 그리드 섹션 */}
                <div className="dashboard-grid">
                    <div className="main-content-column">
                        <RecentSummary />
                    </div>
                    <div className="sidebar-column">
                        <ReservationsLinks />
                        <NoticeBoard />
                    </div>
                </div>
            </div>
        </div>
    );
}